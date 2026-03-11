import useMousePosition from '@/app/hooks/useMousePosition';
import styles from './Tooltip.module.css';
import { useEffect, useState, useRef, useContext } from 'react';
import TooltipContext from '@/app/context/tooltip/context';

export default function Tooltip () {
    const { tooltip } = useContext(TooltipContext);
    const position = useMousePosition();
    const ttRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tt = ttRef.current;
        if (!tt) return;
        tt.style.top = `${position.y + 15}px`;
        tt.style.left = `${position.x + 15}px`;
    }, [position]);

    const className = [
        tooltip.isVisible ? styles.tooltipVisible : styles.tooltipHidden,
        styles.tooltip
    ].join(' ');

    return <>
        <div ref={ttRef} className={className}>
            {tooltip.text}
        </div>
    </>
}