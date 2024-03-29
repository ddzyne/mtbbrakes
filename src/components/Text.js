import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github } from '../images/Svg'

export const Intro = ({isLarge}) => {
  const [ expanded, toggleExpanded ] = useState(false);
  return (
    <div className={`intro ${expanded || isLarge ? 'expanded' : 'collapsed'}`}>
      <h1>Mountain bike brake force visualisation</h1>
      <p>This tool takes brake pad and rotor material out of the equation and looks simply at the leverage ratio of different brakes.</p>
      {isLarge ?
        <ExtraContent />
        :
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <ExtraContent />
            </motion.section>
          )}
        </AnimatePresence>
      }
      { !isLarge &&
        <div 
          className={`expand ${expanded ? 'expanded' : 'collapsed'}`} 
          onClick={() => toggleExpanded(!expanded)}>
          <span>{ expanded ? 'Collapse' : 'Read more about what you see in the chart'}</span>
          <Svg />
        </div>
      }
    </div>
  )
}

const ExtraContent = () =>
  <div>
    <p><strong className="hyd">Hydraulic leverage</strong> is generated by the difference in surface area between the master cylinder in the lever and slave cylinders in the caliper. <strong className="mec">Mechanical leverage</strong> stems from the relation between a lever blade's length, its pivot point and distance to the cam. <strong className="total">Total leverage</strong> is the product of these two. Some brake levers, like Shimano Servowave, use linkages that vary leverage; the pivot point to cam distance gets smaller along the lever stroke. For these brakes, a <strong className="peak">peak leverage</strong> is provided.</p>
    <p><strong className="weight">Weights</strong> are taken from various online weight databases with photo verification. In an effort to equalise these data, length/type/weight of the hoses are taken out of the equation. Plastic hoses weigh around 0.02 g/mm, stainless steel braided hoses just under 0.06 g/mm.</p>
    <h5>Disclaimer</h5>
    <p className="small">The data is in no way complete, not guaranteed 100% accurate, and the mechanical leverage data has some caveats. There is no leverage curve calculated, so data are an estimated average, which may deviate from reality. Also, the mechanical leverage at the brake's contact point depends on the lever throw and distance between the pads and disc rotor, which is not taken into account. This means that a mix & match brake might be theoretically powerful, but also unusable, with a lever throw well beyond the bars. Lever and caliper flex, hose expansion, and hence power loss, are also not taken into account.</p>
  </div>

const Svg = () =>
  <svg fill="currentColor" viewBox="0 0 40 40">
    <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z"/>
  </svg>

export const Copyright = (props) => {
  return (
    <div className={`copyright ${props.className}`}>
      <h4>Copyrights</h4>
      <p>Brake data collected by<br/><a href="https://ridemonkey.bikemag.com/threads/frankenbrakes-and-brake-improvement-discussion.274164/" target="_blank" rel="noopener noreferrer">Udi on RideMonkey</a></p>
      <p>Visualisation tool created by<br/><a href="https://ddzyne.nl" target="_blank" rel="noopener noreferrer">Ddzyne</a></p>
      <a href="https://github.com/daancjanssen/mtbbrakes" target="_blank" rel="noopener noreferrer" title="Source code on Github"><Github/></a>
    </div>
  )
}

