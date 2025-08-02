import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const SvgPeople = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Defs>
      <LinearGradient
        id="PeopleSolidGradient"
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#9F24E1" />
        <Stop offset="1" stopColor="#2932E1" />
      </LinearGradient>
    </Defs>
    <Path
      fill="url(#PeopleSolidGradient)"
      d="M12 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm.002 10c-3.832 0-6.765 2.296-7.956 5.516-.34.92-.107 1.828.434 2.473A2.898 2.898 0 0 0 6.698 21h10.607c.877 0 1.69-.383 2.218-1.011a2.463 2.463 0 0 0 .434-2.473C18.767 14.296 15.833 12 12 12Z"
    />
  </Svg>
);
export default SvgPeople;
