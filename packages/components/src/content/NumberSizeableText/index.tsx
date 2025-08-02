import { useMemo } from 'react';

import type { INumberFormatProps } from '@onekeyhq/shared/src/utils/numberUtils';
import { numberFormat } from '@onekeyhq/shared/src/utils/numberUtils';

import { SizableText } from '../../primitives';
import { getFontSize } from '../../utils';

import type { ISizableTextProps } from '../../primitives';
import type { FontSizeTokens } from 'tamagui';

export type INumberSizeableTextProps = Omit<ISizableTextProps, 'children'> &
  INumberFormatProps & {
    subTextStyle?: Omit<ISizableTextProps, 'children'>;
    children: string | number | undefined;
  };

export function NumberSizeableText({
  children,
  formatter,
  formatterOptions,
  subTextStyle,
  hideValue,
  ...props
}: INumberSizeableTextProps) {
  const result = useMemo(
    () =>
      ['string', 'number'].includes(typeof children)
        ? numberFormat(String(children), { formatter, formatterOptions }, true)
        : '',
    [formatter, formatterOptions, children],
  );

  const scriptFontSize = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      props.fontSize !== 'unset'
        ? Math.ceil(
            (props.fontSize as number) ||
              getFontSize(props.size as FontSizeTokens) * 0.6,
          )
        : props.fontSize,
    [props.fontSize, props.size],
  );

  if (hideValue) {
    if (formatter === 'balance') {
      return (
        <SizableText size="$headingXl" {...props}>
          **** {formatterOptions?.tokenSymbol}
        </SizableText>
      );
    }
    return (
      <SizableText size="$headingXl" {...props}>
        ****
      </SizableText>
    );
  }

  return typeof result === 'string' ? (
    <SizableText {...props}>{result}</SizableText>
  ) : (
    <SizableText {...props}>
      {result.map((r, index) =>
        typeof r === 'string' ? (
          <SizableText size="$headingXl" key={index} {...props}>
            {r}
          </SizableText>
        ) : (
          <SizableText
            size="$headingXl"
            key={index}
            {...props}
            fontSize={scriptFontSize}
            {...subTextStyle}
          >
            {r.value}
          </SizableText>
        ),
      )}
    </SizableText>
  );
}
