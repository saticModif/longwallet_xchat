import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const SvgCompassCircle = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Defs>
      <LinearGradient
        id="compassCircleGradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#A124E1" />
        <Stop offset="100%" stopColor="#2832E1" />
      </LinearGradient>
    </Defs>
    <Path
      fill="url(#compassCircleGradient)"
      fillRule="evenodd"
      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm12.524-3.753a1 1 0 0 1 1.228 1.228l-1.12 4.105a1.5 1.5 0 0 1-1.052 1.052l-4.105 1.12a1 1 0 0 1-1.228-1.228l1.12-4.105a1.5 1.5 0 0 1 1.052-1.052l4.105-1.12Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgCompassCircle;
