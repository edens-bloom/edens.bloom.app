import React from 'react';
import { ArrowRight, Clock, Star, Leaf } from 'lucide-react';
import './FeatureStrip.scss';

const FeatureStrip: React.FC = () => {
  return (
    <div className="strip">
      <div className="strip-item">
        <ArrowRight size={16} />
        Free shipping over $65
      </div>
      <div className="strip-item">
        <Clock size={16} />
        Same-day delivery available
      </div>
      <div className="strip-item">
        <Star size={16} />
        100% fresh guarantee
      </div>
      <div className="strip-item">
        <Leaf size={16} />
        Sustainably sourced
      </div>
    </div>
  );
};

export default FeatureStrip;
