import type { IModalFlowNavigatorConfig } from '@onekeyhq/components';
import { LazyLoadPage } from '@onekeyhq/kit/src/components/LazyLoadPage';
import type { IOnboardingParamList } from '@onekeyhq/shared/src/routes';
import { EOnboardingPages } from '@onekeyhq/shared/src/routes';
import type {
  IKeyOfIcons,
  IPageScreenProps,
  IXStackProps,
} from '@onekeyhq/components';

import {
  Anchor,
  Divider,
  Group,
  Heading,
  Icon,
  IconButton,
  Image,
  LinearGradient,
  Page,
  SizableText,
  Spinner,
  Stack,
  ThemeableStack,
  View,
  XStack,
 
  useSafeAreaInsets,
} from '@onekeyhq/components';
import {Text} from'react-native';

import useAppNavigation from '../../hooks/useAppNavigation';

export function GetStarted({
  route,
}: IPageScreenProps<IOnboardingParamList, EOnboardingPages.GetStarted>) {
  const navigation = useAppNavigation();


  

  return (
    <Page safeAreaEnabled>
      <Page.Header headerShown={false} />
      <Page.Body>
        <Text>hhhh</Text>
      </Page.Body>
    </Page>
  );
}

export default GetStarted;