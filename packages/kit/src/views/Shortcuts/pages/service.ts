/*
 * @Author: baoJT
 * @Date: 2025-01-14 01:55:10
 * @LastEditTime: 2025-02-20 23:17:52
 */
import axios from 'axios';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';

export interface VersionInfo {
  newversion: string;
  content: string;
  downloadurl: string;
  enforce: number;
  title: string;
  android_link: string;
  ios_link: string;
  downqrcode: string;
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  time: string;
  data: T;
}



export const versionService = {
  async getVersionInfo(): Promise<VersionInfo> {
    try {
      const response = await axios.get<ApiResponse<VersionInfo>>(
        `${CUSTOM_NETWORK_URL}/api/bus/Version/newVersion`,
      );
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.msg);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`获取版本信息失败: ${error.message}`);
      }
      throw new Error('获取版本信息失败');
    }
  },
};

// https://walletad.ispay.vip/api/bus/Nav/getImg form-data
// [{"app_name": "IspayWallet", "id": 1, "image": "https://walletad.ispay.vip/uploads/20250214/b0462f636c73f01e991eeabc6dfdff6f.jpg", "img_type": 2, "img_type_text": "邀请页", "status": 1}]
export const getBrandImage = async (params) => {
  console.log('params', params);
  try {
    const formData = new FormData();
    // 将params对象的键值对添加到FormData中
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const response = await axios.post<ApiResponse<string>>(
      `${CUSTOM_NETWORK_URL}/api/bus/Nav/getImg`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (response.data.code === 200) {
      console.log('brandImage', response.data.data);
      return response.data.data;
    }
    throw new Error(response.data.msg);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`获取品牌图片失败: ${error.message}`);
    }
    throw new Error('获取品牌图片失败');
  }
};
