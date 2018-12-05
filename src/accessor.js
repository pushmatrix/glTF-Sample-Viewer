class gltfAccessor
{
    constructor(bufferView = undefined, byteOffset = 0,
                componentType = undefined, normalized = false,
                count = undefined, type = undefined,
                max = undefined, min = undefined,
                sparse = undefined, name = undefined)
    {
        this.bufferView = bufferView;
        this.byteOffset = byteOffset;
        this.componentType = componentType;
        this.normalized = normalized;
        this.count = count;
        this.type = type;
        this.max = max;
        this.min = min;
        this.sparse = sparse;
        this.name = name;
        this.typedView = undefined;
        this.glBuffer = undefined;

        this.componentCount = new Map();
        this.componentCount.set("SCALAR", 1);
        this.componentCount.set("VEC2", 2);
        this.componentCount.set("VEC3", 3);
        this.componentCount.set("VEC4", 4);
        this.componentCount.set("MAT2", 4);
        this.componentCount.set("MAT3", 9);
        this.componentCount.set("MAT4", 16);
    }

    getComponentCount()
    {
        return this.componentCount.get(this.type);
    }
    
    getComponentSize()
    {
        let size = 0;
        
        switch (this.componentType)
        {
        case gl.BYTE:
            size = 1;
            break;
        case gl.UNSIGNED_BYTE:
            size = 1;
            break;
        case gl.SHORT:
            size = 2;
            break;
        case gl.UNSIGNED_SHORT:
            size = 2;
            break;
        case gl.UNSIGNED_INT:
            size = 4;
            break;
        case gl.FLOAT:
            size = 4;
            break;
        }
        
        return size;
    }

    getTypedView(gltf)
    {
        if (this.typedView !== undefined)
        {
            return this.typedView;
        }

        if (this.bufferView !== undefined)
        {
            let bufferView = gltf.bufferViews[this.bufferView];
            let buffer = gltf.buffers[bufferView.buffer];
            let byteOffset = bufferView.byteOffset;

            let componentCount = this.getComponentCount();
            if (bufferView.byteStride != 0)
            {
                componentCount = bufferView.byteStride / this.getComponentSize();
            }

            let arrayOffsetLength = this.byteOffset / this.getComponentSize();
            let arrayLength = arrayOffsetLength + this.count * componentCount;

            switch (this.componentType)
            {
            case gl.BYTE:
                this.typedView = new Int8Array(buffer.buffer, byteOffset, arrayLength);
                break;
            case gl.UNSIGNED_BYTE:
                this.typedView = new Uint8Array(buffer.buffer, byteOffset, arrayLength);
                break;
            case gl.SHORT:
                this.typedView = new Int16Array(buffer.buffer, byteOffset, arrayLength);
                break;
            case gl.UNSIGNED_SHORT:
                this.typedView = new Uint16Array(buffer.buffer, byteOffset, arrayLength);
                break;
            case gl.UNSIGNED_INT:
                this.typedView = new Uint32Array(buffer.buffer, byteOffset, arrayLength);
                break;
            case gl.FLOAT:
                this.typedView = new Float32Array(buffer.buffer, byteOffset, arrayLength);
                break;
            }
        }

        if (this.typedView === undefined)
        {
            console.warn("Failed to convert buffer view to typed view!: " + this.bufferView);
        }

        return this.typedView;
    }

    fromJson(jsonAccessor)
    {
        fromKeys(this, jsonAccessor);
    }

    destroy()
    {
        if (this.glBuffer !== undefined)
        {
            gl.deleteBuffer(this.glBuffer);
        }

        this.glBuffer = undefined;
    }
};
