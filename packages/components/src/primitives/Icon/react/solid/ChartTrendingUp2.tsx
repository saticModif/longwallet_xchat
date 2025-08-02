import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
const SvgChartTrendingUp2 = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Defs>
      <LinearGradient
        id="chartTrendingUp2Gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        {/* <Stop offset="0%" stopColor="#A124E1" />
        <Stop offset="100%" stopColor="#2832E1" /> */}
        <Stop offset="0%" stopColor="#0473F9" />
        <Stop offset="100%" stopColor="#0473F9" />
      </LinearGradient>
    </Defs>
    <Path
      fill="url(#chartTrendingUp2Gradient)"
      fillRule="evenodd"
      d="M3 4a1 1 0 0 1 1 1v12a1 1 0 0 0 1 1h16a1 1 0 1 1 0 2H5a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1Zm12 4a1 1 0 1 1 0-2h4a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9.414l-3.293 3.293a2.414 2.414 0 0 1-3.414 0 .414.414 0 0 0-.586 0l-3 3a1 1 0 0 1-1.414-1.414l3-3a2.414 2.414 0 0 1 3.414 0 .414.414 0 0 0 .586 0L16.586 8H15Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgChartTrendingUp2;
