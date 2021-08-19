import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FadeLoader = (props) =>
  <AnimatePresence>
    {props.loading &&
      <motion.div
        initial={{opacity: 0 }}
        animate={{opacity: 1 }}
        exit={{opacity: 0 }}
        className={`loader ${props.className}`}>
        <Spinner />
      </motion.div>
    }
  </AnimatePresence>

const Spinner = props => (
  <svg
    className="spinner"
    width={60}
    height={60}
    viewBox="0 0 60 60"
    {...props}
  >
    <circle className="path" fill="none" cx={30} cy={30} r={27} />
  </svg>
);