import React from 'react';
import { Formik } from 'formik';
import {
  SearchIcon,
  FlameIcon,
  BinLinearIcon,
} from '@commercetools-uikit/icons';
import TextField, { CustomFormikErrors } from '@commercetools-uikit/text-field';
import IconButton from '@commercetools-uikit/icon-button';
import Spacings from '@commercetools-uikit/spacings';
import { FormModalPage } from '@commercetools-frontend/application-components';
import { Suite, Spec } from '../../test-utils';

export const routePath = '/form-modal-page';

type ContainerProps = {
  portalId: string;
} & Partial<Parameters<typeof FormModalPage>[0]>;
type FormValues = {
  email: string;
};

const ModalPageWithPortalParentSelector = ({
  portalId,
  ...props
}: ContainerProps) => (
  <>
    <div id={portalId} style={{ position: 'relative', height: '750px' }} />
    <Formik<FormValues>
      initialValues={{ email: '' }}
      onSubmit={() => undefined}
    >
      {formikProps => (
        <FormModalPage
          title="Lorem ipsum"
          isOpen={true}
          onClose={() => undefined}
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onSecondaryButtonClick={() => undefined}
          onPrimaryButtonClick={() => undefined}
          isPrimaryButtonDisabled={props.isPrimaryButtonDisabled}
          getParentSelector={() =>
            document.querySelector(`#${portalId}`) as HTMLElement
          }
          {...props}
        >
          <TextField
            name="email"
            title="Email"
            isRequired={true}
            value={formikProps.values.email}
            errors={
              (formikProps.errors as CustomFormikErrors<FormValues>).email
            }
            touched={formikProps.touched.email}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            horizontalConstraint="m"
          />
        </FormModalPage>
      )}
    </Formik>
  </>
);
ModalPageWithPortalParentSelector.displayName =
  'ModalPageWithPortalParentSelector';

export const Component = () => (
  <Suite>
    <Spec label="FormModalPage" size="xl">
      <ModalPageWithPortalParentSelector portalId="form-modal-one" />
    </Spec>
    <Spec label="FormModalPage - Primary button disabled" size="xl">
      <ModalPageWithPortalParentSelector
        portalId="form-modal-disabled"
        isPrimaryButtonDisabled
      />
    </Spec>
    <Spec label="FormModalPage - Long title and subtitle" size="xl">
      <ModalPageWithPortalParentSelector
        portalId="form-modal-long"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        subtitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      />
    </Spec>
    <Spec label="FormModalPage - with Custom Controls" size="xl">
      <ModalPageWithPortalParentSelector
        customControls={
          <Spacings.Inline>
            <IconButton
              label="Search"
              icon={<SearchIcon />}
              onClick={() => undefined}
            />
            <IconButton
              label="Update"
              icon={<FlameIcon />}
              onClick={() => undefined}
            />
            <IconButton
              label="Delete"
              icon={<BinLinearIcon />}
              onClick={() => undefined}
            />
          </Spacings.Inline>
        }
        portalId="form-modal-custom"
      />
    </Spec>
  </Suite>
);