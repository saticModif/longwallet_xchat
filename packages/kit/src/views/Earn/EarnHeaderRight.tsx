import { Stack,SizableText } from '@onekeyhq/components';
import {
    HeaderButtonGroup,
    HeaderIconButton,
  } from '@onekeyhq/components/src/layouts/Navigation/Header';
import { useNotificationsAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { EModalRoutes } from '@onekeyhq/shared/src/routes';
import { EModalNotificationsRoutes } from '@onekeyhq/shared/src/routes/notifications';
import { useCallback } from 'react';
import useAppNavigation from '../../hooks/useAppNavigation';

export function EarnHeaderRight() {
    const [{ firstTimeGuideOpened, badge }] = useNotificationsAtom();
    const navigation = useAppNavigation();
  
    const openNotificationsModal = useCallback(() => {
      navigation.pushModal(EModalRoutes.NotificationsModal, {
        screen: EModalNotificationsRoutes.NotificationList,
      });
    }, [navigation]);
  
    const toggleTheme = useCallback(() => {
    }, []);
  
    return (
      <HeaderButtonGroup>
      <HeaderIconButton
        key="moon"
        icon="MoonStarOutline"
        onPress={()=>{}}
      />
        <Stack key="notifications" testID="headerRightNotificationsButton">
        <HeaderIconButton
          icon="BellOutline"
          onPress={()=>{}}
        />
        {!firstTimeGuideOpened || badge ? (
          <Stack
            position="absolute"
            right="$-2.5"
            top="$-2"
            alignItems="flex-end"
            w="$10"
            pointerEvents="none"
          >
            <Stack
              bg="$bgApp"
              borderRadius="$full"
              borderWidth={2}
              borderColor="$transparent"
            >
              <Stack
                px="$1"
                borderRadius="$full"
                bg="$bgCriticalStrong"
                minWidth="$4"
                height="$4"
                alignItems="center"
                justifyContent="center"
              >
                {!firstTimeGuideOpened ? (
                  <Stack
                    width="$1"
                    height="$1"
                    backgroundColor="white"
                    borderRadius="$full"
                  />
                ) : (
                  <SizableText color="$textOnColor" size="$bodySm">
                    {badge && badge > 99 ? '99+' : badge}
                  </SizableText>
                )}
              </Stack>
            </Stack>
          </Stack>
        ) : null}
        </Stack>
      </HeaderButtonGroup>
    );
  }
