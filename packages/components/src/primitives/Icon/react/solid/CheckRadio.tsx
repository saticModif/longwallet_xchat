import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const SvgCheckRadio = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Defs>
      <LinearGradient
        id="checkRadioSolidGradient"
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        {/* <Stop offset="0" stopColor="#9827CE" />
        <Stop offset="1" stopColor="#2A30DF" /> */}
        <Stop offset="0" stopColor="#0473F9" />
        <Stop offset="1" stopColor="#0473F9" />
      </LinearGradient>
    </Defs>
    <Path
      fill="url(#checkRadioSolidGradient)"
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm3.774 8.133a1 1 0 0 0-1.548-1.266l-3.8 4.645-1.219-1.22a1 1 0 0 0-1.414 1.415l2 2a1 1 0 0 0 1.481-.074l4.5-5.5Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgCheckRadio;
