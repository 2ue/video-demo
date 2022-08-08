const localstorage = window.store;

export default {
  sdkAppId: 1400717540,
  secretKey: 'afc62bb613d018a56676250cc16c16b268342cbb5887ed9b47a7416f1fa94936',
  userId: localstorage.getItem('userId') || '',
  roomId: '',
  cameraId: '',
  microphoneId: '',
};
