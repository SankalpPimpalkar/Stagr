import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

const TagNode = ({ data, isConnectable }) => {
    return (
        <div className="relative group/node cursor-pointer">
            {/* Node */}
            <div className="w-3 h-3 bg-base-content/30 rounded-full hover:bg-base-content/80 hover:scale-150 transition-all duration-300 shadow-lg border border-transparent hover:border-base-content/20">
            </div>

            {/* Label - Visible on hover only */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 px-2 py-1 rounded-md bg-black/80 text-white text-[10px] font-medium opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
                #{data.label}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="opacity-0"
            />
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="opacity-0"
            />
        </div>
    );
};

export default memo(TagNode);
