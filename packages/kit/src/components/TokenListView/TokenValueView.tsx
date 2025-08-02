import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { ISizableTextProps } from '@onekeyhq/components';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';

import { useTokenListMapAtom } from '../../states/jotai/contexts/tokenList';
import NumberSizeableTextWrapper from '../NumberSizeableTextWrapper';

type IProps = {
  close: string | number;
  // tokenVale: object;
  $key: string;
  hideValue?: boolean;
} & ISizableTextProps;

function TokenValueView(props: IProps) {
  const { close, symbol, $key, ...rest } = props;
  const [settings] = useSettingsPersistAtom();
  const [tokenListMap] = useTokenListMapAtom();

  const token = tokenListMap[$key];
  // const symbol = tokenVale?.name ?? "un"
  const fiatValue = useMemo(
    () => {
      if(symbol == 'ISPAY') {
        return new BigNumber(close*(token?.balanceParsed??0))
      }
      return new BigNumber(token?.fiatValue??0)
    },
    [token?.fiatValue,close,symbol,token?.balanceParsed],
  );

  const content = useMemo(
    () => (
      <NumberSizeableTextWrapper
        formatter="value"
        formatterOptions={{ currency: settings.currencyInfo.symbol }}
        {...rest}
      >
        {fiatValue.isNaN() ? 0 : fiatValue.toFixed()}
      </NumberSizeableTextWrapper>
    ),
    [fiatValue, rest, settings.currencyInfo.symbol],
  );

  if (!token) {
    return null;
  }

  return content;
}

export { TokenValueView };
