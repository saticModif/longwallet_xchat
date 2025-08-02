import React, { useState, useEffect } from 'react';
import {
  Page,
  Form,
  Input,
  Button,
  YStack,
  Text,
  Alert,
  XStack,
} from '@onekeyhq/components';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { setBotToken, getBotToken } from '../services/telegramApi';

export default function BotConfig() {
  const intl = useIntl();
  const [botToken, setBotTokenState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // 加载已保存的Bot Token
    loadBotToken();
  }, []);

  const loadBotToken = async () => {
    try {
      const token = await getBotToken();
      if (token) {
        setBotTokenState(token);
      }
    } catch (error) {
      console.error('加载Bot Token失败:', error);
    }
  };

  const handleSave = async () => {
    if (!botToken.trim()) {
      setMessage({ type: 'error', text: '请输入Bot Token' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await setBotToken(botToken.trim());
      setMessage({ type: 'success', text: 'Bot Token保存成功' });
    } catch (error) {
      console.error('保存Bot Token失败:', error);
      setMessage({ type: 'error', text: '保存失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await setBotToken('');
      setBotTokenState('');
      setMessage({ type: 'success', text: 'Bot Token已清除' });
    } catch (error) {
      console.error('清除Bot Token失败:', error);
      setMessage({ type: 'error', text: '清除失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page fullPage>
      <Page.Header title="Telegram Bot 配置" />
      <Page.Body>
        <YStack space="$4" p="$4">
          <Text variant="$bodyLg" color="$textSubdued">
            配置Telegram Bot Token以使用官方API获取频道信息
          </Text>

          <Form>
            <Form.Field
              name="botToken"
              label="Bot Token"
              description="从 @BotFather 获取的Bot Token"
            >
              <Input
                value={botToken}
                onChangeText={setBotTokenState}
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                secureTextEntry
                size="large"
              />
            </Form.Field>
          </Form>

          {message && (
            <Alert
              type={message.type === 'success' ? 'success' : 'error'}
              title={message.text}
            />
          )}

          <YStack space="$3">
            <Button
              size="large"
              onPress={handleSave}
              loading={isLoading}
              disabled={!botToken.trim()}
            >
              保存 Bot Token
            </Button>

            <Button
              size="large"
              variant="secondary"
              onPress={handleClear}
              loading={isLoading}
              disabled={!botToken.trim()}
            >
              清除 Bot Token
            </Button>
          </YStack>

          <YStack space="$3" mt="$6">
            <Text variant="$headingMd">如何获取Bot Token？</Text>
            <Text variant="$bodyMd" color="$textSubdued">
              1. 在Telegram中搜索 @BotFather
            </Text>
            <Text variant="$bodyMd" color="$textSubdued">
              2. 发送 /newbot 命令创建新Bot
            </Text>
            <Text variant="$bodyMd" color="$textSubdued">
              3. 按照提示设置Bot名称和用户名
            </Text>
            <Text variant="$bodyMd" color="$textSubdued">
              4. 复制获得的Bot Token并粘贴到上方输入框
            </Text>
          </YStack>

          <YStack space="$3" mt="$4">
            <Text variant="$headingMd">注意事项</Text>
            <Text variant="$bodyMd" color="$textSubdued">
              • Bot Token是敏感信息，请妥善保管
            </Text>
            <Text variant="$bodyMd" color="$textSubdued">
              • 如果不配置Bot Token，将使用模拟数据
            </Text>
            <Text variant="$bodyMd" color="$textSubdued">
              • Bot需要被添加到频道中才能获取频道信息
            </Text>
          </YStack>
        </YStack>
      </Page.Body>
    </Page>
  );
} 