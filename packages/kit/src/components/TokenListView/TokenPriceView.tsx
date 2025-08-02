import { useMemo } from 'react';

import type { ISizableTextProps } from '@onekeyhq/components';
import { NumberSizeableText } from '@onekeyhq/components';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';

import { useTokenListMapAtom } from '../../states/jotai/contexts/tokenList';

type IProps = {
  $key: string;
} & ISizableTextProps;

function TokenPriceView(props: IProps) {
  const { $key, symbol, close, ...rest } = props;
  const [settings] = useSettingsPersistAtom();
  const [tokenListMap] = useTokenListMapAtom();
  const token = tokenListMap[$key];
  // const symbol = tokenVale?.name ?? "un"
  const price = useMemo(
    () => {
      if (symbol == 'ISPAY') {
        return close
      }
      return token?.price ?? 0
    },
    [token?.price, close, symbol],
  );
  const content = useMemo(
    () => (
      <NumberSizeableText
        formatter="price"
        formatterOptions={{ currency: settings.currencyInfo.symbol }}
        {...rest}
      >
        {price}
      </NumberSizeableText>
    ),
    [rest, settings.currencyInfo.symbol, token?.price],
  );
  return content;
}

export { TokenPriceView };
