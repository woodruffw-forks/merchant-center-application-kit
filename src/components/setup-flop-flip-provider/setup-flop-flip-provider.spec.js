import React from 'react';
import { shallow } from 'enzyme';
import { ConfigureFlopFlip } from '@flopflip/react-broadcast';
import { SetupFlopFlipProvider } from './setup-flop-flip-provider';

const createTestProps = props => ({
  ldClientSideId: '111',
  user: {
    id: 'u1',
    launchdarklyTrackingId: '123',
    launchdarklyTrackingGroup: 'ct',
    launchdarklyTrackingProject: 'test-project',
  },
  children: jest.fn(),
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<SetupFlopFlipProvider {...props} />);
  });
  it('should render <ConfigureFlopFlip>', () => {
    expect(wrapper).toRender(ConfigureFlopFlip);
  });
  it('should pass "clientSideId" as adapter arg', () => {
    expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
      'adapterArgs',
      expect.objectContaining({
        clientSideId: props.ldClientSideId,
      })
    );
  });
  it('should pass "user.key" as adapter arg', () => {
    expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
      'adapterArgs',
      expect.objectContaining({
        user: expect.objectContaining({
          key: props.user.id,
        }),
      })
    );
  });
  it('should pass "user.custom.id" as adapter arg', () => {
    expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
      'adapterArgs',
      expect.objectContaining({
        user: expect.objectContaining({
          custom: expect.objectContaining({
            id: props.user.launchdarklyTrackingId,
          }),
        }),
      })
    );
  });
  it('should pass "user.custom.group" as adapter arg', () => {
    expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
      'adapterArgs',
      expect.objectContaining({
        user: expect.objectContaining({
          custom: expect.objectContaining({
            group: props.user.launchdarklyTrackingGroup,
          }),
        }),
      })
    );
  });
  describe('when user is not defined', () => {
    beforeEach(() => {
      props = createTestProps({ user: null });
      wrapper = shallow(<SetupFlopFlipProvider {...props} />);
    });
    it('should set "shouldDeferAdapterConfiguration" to true', () => {
      expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
        'shouldDeferAdapterConfiguration',
        true
      );
    });
  });
  describe('when user is defined', () => {
    it('should set "shouldDeferAdapterConfiguration" to false', () => {
      expect(wrapper.find(ConfigureFlopFlip)).toHaveProp(
        'shouldDeferAdapterConfiguration',
        false
      );
    });
  });
});
