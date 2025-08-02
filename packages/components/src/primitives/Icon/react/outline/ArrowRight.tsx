import Svg, { SvgProps, Path } from 'react-native-svg';
const SvgArrowRight = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" accessibilityRole="image" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M14.707 12L9 6.293a1 1 0 0 1 1.414-1.414l6.364 6.364a1 1 0 0 1 0 1.414l-6.364 6.364a1 1 0 0 1-1.414-1.414L14.707 12Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgArrowRight;
