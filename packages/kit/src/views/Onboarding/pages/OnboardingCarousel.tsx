import { useCallback, useState, useRef } from 'react';
import { Image, YStack } from '@onekeyhq/components';
import {
  Button,
  Page,
  Stack,
  Heading,
  SizableText,
  XStack,
} from '@onekeyhq/components';
import { useWindowDimensions } from 'react-native';
import { useToOnBoardingPage } from './GetStarted';
import Carousel from 'react-native-snap-carousel';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';



interface IFeatureSlide {
  title: string;
  description: string;
  imageSource: any;
}



export function OnboardingCarousel() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const toOnBoardingPage = useToOnBoardingPage();
  const intl = useIntl();

  const features: IFeatureSlide[] = [
    {
      title: 'Multi-chain wallet, secure and easy to use',
      description: 'Support mainstream public chains, EVM-compatible chains and 4Layer2',
      imageSource: require('@onekeyhq/kit/assets/onboarding-1.png'),
    },
    {
      title: 'Private key ownership, self-control of assets',
      description: 'The private key is kept only on your device and is held by the individual',
      imageSource: require('@onekeyhq/kit/assets/onboarding-2.png'),
    },
    {
      title: 'convertible',
      description: 'Convenient, safer and better fulfillment of your transactions',
      imageSource: require('@onekeyhq/kit/assets/onboarding-3.png'),
    },
  ];


  const renderItem = useCallback(({ item }: { item: IFeatureSlide }) => (
    <Stack px="$5" alignItems="center" justifyContent="center" width={width}>
      <Image
        w={300}
        h={300}
        source={item.imageSource}
      />
      <Stack mt="$10">
        <Heading size="$headingLg" textAlign="center">
          {item.title}
        </Heading>
        <SizableText
          mt="$3"
          size="$bodyMdMedium"
          textAlign="center"
          color="$textSubdued"
        >
          {item.description}
        </SizableText>
      </Stack>
    </Stack>
  ), [width]);

  return (
    <Page safeAreaEnabled>
      <Page.Header headerShown={false} />
      <YStack flex={1} justifyContent="center">
        <Stack>
          <Carousel
            ref={carouselRef}
            data={features}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index) => setActiveIndex(index)}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            autoplay
            autoplayInterval={3000}
            loop
          />
          <XStack mt="$10" justifyContent="center" space="$2">
            {features.map((_, index) => (
              <Stack
                key={index}
                w="$2"
                h="$2"
                borderRadius="$full"
                bg={index === activeIndex ? '$bgReverse' : '$bgSubdued'}
                pressStyle={{
                  scale: 0.95,
                }}
              />
            ))}
          </XStack>
        </Stack>
        <XStack justifyContent="center" mt="$10">
          <Button
            width="90%"
            variant="gradient"
            onPress={() => {
              void toOnBoardingPage({ isFullModal: true, params: 'EOnboardingPages.GetStarted' });
            }}
          >
            Get Started
          </Button>
        </XStack>
      </YStack>
    </Page>
  );
}