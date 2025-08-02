import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
interface RecordParams {
  secen: number;
  device_no: string;
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  time: string;
  data: T;
}

export const walletService = {
  async recordWalletCreation(): Promise<void> {
    // try {
    //   const deviceId = await DeviceInfo.getUniqueId();

    //   const response = await axios.post<ApiResponse<any>>(
    //     `${CUSTOM_NETWORK_URL}/api/bus/Record`,
    //     {
    //       secen: 1,
    //       device_no: deviceId,
    //     },
    //   );

    //   // if (response.data.code !== 200) {
    //   //   throw new Error(response.data.msg);
    //   // }

    //   return response?.data?.data;
    // } catch (error) {
    //   // if (error instanceof Error) {
    //   //   throw new Error(`记录钱包创建失败: ${error.message}`);
    //   // }
    //   // throw new Error('记录钱包创建失败');
    // }
  },
};