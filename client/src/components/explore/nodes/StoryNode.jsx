import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

const StoryNode = ({ data, isConnectable }) => {
    return (
        <div className="relative group cursor-pointer z-10">
            {/* Outer Ring */}
            <div className="absolute -inset-2 rounded-full border border-base-content/10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>

            {/* Main Node */}
            <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center border border-base-content/20 shadow-xl group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300">
                <div className="text-xl">📄</div>
            </div>

            {/* Label */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center w-32">
                <p className="text-[10px] font-bold text-base-content/80 bg-base-100/50 backdrop-blur px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                    {data.label}
                </p>
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

export default memo(StoryNode);
