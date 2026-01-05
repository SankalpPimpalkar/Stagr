import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

const TopicNode = ({ data, isConnectable }) => {
    return (
        <div className="relative group cursor-pointer">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60"></div>

            {/* Node Content */}
            <div className="relative w-6 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)] border-2 border-primary/20 flex items-center justify-center transform group-hover:scale-125 transition-all duration-300">
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
            </div>

            {/* Label - Floating */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-base-100/80 backdrop-blur-md border border-base-content/10 text-xs font-bold tracking-wider text-base-content uppercase shadow-lg pointer-events-none">
                {data.label}
            </div>

            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="opacity-0"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="opacity-0"
            />
        </div>
    );
};

export default memo(TopicNode);
