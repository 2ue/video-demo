const localstorage = window.store;

export default {
  sdkAppId: 1400680441,
  secretKey: 'a1adac874b116364cee6bd4af955b629c88d57e146c4ead62b37138a039e1a1c',
  userId: localstorage.getItem('userId') || '',
  roomId: 999,
  cameraId: '',
  microphoneId: '',
};
