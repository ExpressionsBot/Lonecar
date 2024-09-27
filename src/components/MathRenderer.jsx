import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

const MathRenderer = ({ math, block = false }) => {
  const Component = block ? BlockMath : InlineMath;
  return <Component math={math} />;
};

export default MathRenderer;
