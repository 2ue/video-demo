import { WebPersistence } from '@tencent/andon-web-persistence';
const  webPersistence = new WebPersistence({ token: '58FE324D0D0444E38D3AF96B' });
const persistence = webPersistence.createPersistenceInstance({ app: 'simonju', env: 'dev' });

export default {
  namespaced: true,
  state: {
    persistence,
  },
  actions: {
    updateRemoteStore(root, { roomId, groupId, groupOwnerId, status = 'on' }) {
      // const { groupId } = rootState.tim;
      // console.log('rootState=====>', rootState);
      persistence.set(`yf_${roomId}`, { groupId, roomId, groupOwnerId, status });
    },
    // getRemoteStore({ rootState }) {
    //   persistence.get(`yf_${rootState.roomId}`).then((res) => {
    //     console.log('res==>', res);
    //   });
    // },
  },
};
