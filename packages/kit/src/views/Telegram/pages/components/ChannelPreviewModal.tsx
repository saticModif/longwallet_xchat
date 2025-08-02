import React from 'react';
import { Alert } from 'react-native';

interface ChannelInfo {
  id: string;
  title?: string;
  type?: string;
  description?: string;
  member_count?: number;
  username?: string;
}

interface ChannelPreviewModalProps {
  channelInfo: ChannelInfo;
}

export const showChannelPreview = (channelInfo: ChannelInfo) => {
  const previewInfo = `频道名称: ${channelInfo.title || '未知频道'}
频道类型: ${channelInfo.type === 'channel' ? '公开频道' : '私有频道'}
成员数量: ${channelInfo.member_count || '未知'}
频道描述: ${channelInfo.description || '暂无描述'}
频道用户名: ${channelInfo.username ? '@' + channelInfo.username : '无'}
频道ID: ${channelInfo.id}

这是一个预览信息，您可以：
1. 查看频道基本信息
2. 决定是否加入频道
3. 了解更多频道内容`;
  
  Alert.alert('频道预览', previewInfo);
};

export const ChannelPreviewModal: React.FC<ChannelPreviewModalProps> = ({ channelInfo }) => {
  return null; // 这个组件主要用于类型定义，实际显示通过Alert实现
}; 