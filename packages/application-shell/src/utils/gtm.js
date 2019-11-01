/**
 * Google Tag Manager (GTM) Tracking Utilities
 */
import camelcase from 'lodash/camelCase';
import logger from './logger';

const getDataAttribute = (node, key) => {
  if (node.dataset) {
    const camelKey = camelcase(key.replace(/^data-/, ''));
    return node.dataset[camelKey];
  }
  return undefined;
};

// The way that tracking works is like so:
//
// `data-track-component`: used to set up the hierarchy of the tracking ID.
// `data-track-event`: if this attribute exists, track the event.
// `data-track-strict`: if this exists, do not handle event bubbling.
// `data-track-label`: additional meta information.

// Whitelisting and mapping certain generated event names to hardcoded events.
// They should be keyed by generated name, valued by hardcoded name.
export const defaultEventWhitelist = {
  LanguageSwitch: 'LanguageSwitch',
  ProjectSwitch: 'ProjectSwitch',
  ForgotPassword: 'ForgotPassword',
};

const logTracking = (
  { event, hierarchy, label },
  { isIgnored } = { isIgnored: false }
) => {
  const groupName = `%cGTM ${
    isIgnored ? '%cignoring' : '%cperforming'
  } %ctracking %c${hierarchy} %c${label}`;

  logger.groupCollapsed(
    groupName,
    'color: gray; font-weight: bold;',
    `color: ${isIgnored ? 'orangered' : 'seagreen'}; font-weight: lighter;`,
    'color: gray; font-weight: lighter;',
    'color: goldenrod; font-style: normal;',
    'color: cornflowerblue; font-style: normal;'
  );

  logger.log('%cevent', 'color: cadetblue;', event);
  logger.log('%chierarchy', 'color: goldenrod; font-weight: bold;', hierarchy);
  logger.log('%clabel', 'color: cornflowerblue; font-weight: bold;', label);

  logger.groupEnd();
};

export const track = (event, hierarchy, label) => {
  if (!window.dataLayer) return;

  logTracking({
    event,
    hierarchy,
    label,
  });

  // sends event to google tag manager based on the mapping defined there
  // https://tagmanager.google.com/?authuser=2#/container/accounts/374886/containers/2308084/workspaces/6/tags
  // the mapped event is then forwarded to google analytics
  window.dataLayer.push({
    event: 'TrackingEvent',
    trackingCategory: hierarchy,
    trackingAction: event,
    trackingLabel: label,
    // trackingValue: metadata # TODO: use `custom dimensions`
  });
};

// Sometimes necessary to manually get the hierarchy.
export const getHierarchy = node => {
  const hierarchy = [];
  let parent = node;

  while (parent) {
    const dataTrackComponent = getDataAttribute(parent, 'data-track-component');
    if (dataTrackComponent) hierarchy.push(dataTrackComponent);

    parent = parent.parentNode;
  }

  hierarchy.reverse();
  return hierarchy.join('-');
};

const eventHandler = (name, trackingEventWhitelist) => event => {
  let hierarchy = [];
  let node;
  let trackEvent;
  let trackLabel;
  let trackStrict;

  node = event.target;
  const originalNode = node;

  // Traverse the target elements' parents to find a `data-track` attribute,
  // and if none is found then do nothing.
  while (node) {
    const dataTrackComponent = getDataAttribute(node, 'data-track-component');
    const dataTrackEvent = getDataAttribute(node, 'data-track-event');
    const dataTrackLabel = getDataAttribute(node, 'data-track-label');
    const dataTrackStrict = getDataAttribute(node, 'data-track-strict');

    if (dataTrackEvent && (!dataTrackStrict || originalNode === node)) {
      trackEvent = dataTrackEvent;
      trackLabel = dataTrackLabel;
      trackStrict = dataTrackStrict;

      if (trackStrict) hierarchy.push(trackStrict);
    }

    if (dataTrackComponent) hierarchy.push(dataTrackComponent);

    node = node.parentNode;
  }

  if (trackEvent !== name) return;

  hierarchy = hierarchy.reverse().join('-');

  // The event map also serves as a whitelist. This is really not intuitive
  // by looking at the name.

  // Since we don't want to have all caught events to be sent automatically
  // but only certain events that we are interesting in actually tracking
  // there is a whitelist of events that specifies which events should be
  // sent to Google Tag manager

  // Every application of the Merchant Center should maintain its own list of
  // events it wants to be tracked. This list is passed in via the
  // trackingEventWhitelist parameter that needs to be merged with the
  // default event whitelist
  // The default whitelist contains all events that are not generated by a
  // specific application, but by parts of the application shell itself like the
  // menu or the profile view.

  const eventWhiteList = {
    ...defaultEventWhitelist,
    ...trackingEventWhitelist,
  };
  // This checks:
  // 1. if the event is in the whitelist and is a string, map it
  // 2. if the event is in the whitelist, is an object,
  //   and there is a matching key, then map to the value
  // 3. if the event is not in the whitelist then don't track
  if (typeof eventWhiteList[hierarchy] === 'string')
    hierarchy = eventWhiteList[hierarchy];
  else if (
    typeof eventWhiteList[hierarchy] === 'object' &&
    trackLabel in eventWhiteList[hierarchy]
  )
    hierarchy = eventWhiteList[hierarchy][trackLabel];
  else {
    logTracking(
      {
        event: trackEvent,
        hierarchy:
          typeof hierarchy === 'object' && trackLabel in hierarchy
            ? hierarchy[trackLabel]
            : hierarchy,
        label: trackLabel,
      },
      { isIgnored: true }
    );

    return;
  }

  logTracking({
    event: trackEvent,
    hierarchy:
      typeof hierarchy === 'object' ? hierarchy[trackLabel] : hierarchy,
    label: trackLabel,
  });

  track(trackEvent, hierarchy, trackLabel);
};

const events = ['click', 'change', 'drop'];

export const boot = trackingEventWhitelist => {
  events.forEach(event => {
    const handler = eventHandler(event, trackingEventWhitelist);
    window.addEventListener(event, handler, true);
  });
};

export const updateUser = user => {
  if (window.dataLayer && window.app.trackingGtm)
    window.dataLayer.push({ userId: user.id });
};

export const stopTrackingUser = () => {
  if (window.dataLayer && window.app.trackingGtm)
    window.dataLayer.push({ userId: undefined });
};
