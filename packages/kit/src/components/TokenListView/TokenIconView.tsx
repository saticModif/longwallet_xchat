import { useAccountData } from '../../hooks/useAccountData';
import { Token } from '../Token';

type IProps = {
  tableLayout?: boolean;
  icon?: string;
  symbol?: string;
  networkId: string | undefined;
  isAllNetworks?: boolean;
};

function TokenIconView(props: IProps) {
  const { tableLayout, icon, networkId, isAllNetworks, symbol } = props;

  const { network } = useAccountData({ networkId });

  const ispayIcon = 'https://wallet.66kuaifa.com/uploads/20250115/b39b34401a930b3b14601813d5c090df.png';

  if (isAllNetworks) {
    return (
      <Token
        size={tableLayout ? 'md' : 'lg'}
        tokenImageUri={symbol=='ISPAY'?ispayIcon:icon}
        networkImageUri={network?.logoURI }
        networkId={networkId}
        showNetworkIcon
        symbol={symbol}
      />
    );
  }

  return <Token size={tableLayout ? 'md' : 'lg'} symbol={symbol} networkId={networkId} tokenImageUri={symbol=='ISPAY'?ispayIcon:icon} />;
}

export { TokenIconView };
