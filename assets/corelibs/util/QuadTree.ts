class QuadTree<T> {
    //根节点;
    private root:any;
    private x:number;
    private y:number;
    private width:number;
    private height:number;
    //最大子节点;
    private maxc:number;
    private leafratio:number;
    constructor(x:number, y:number, w:number, h:number, options?) {
        if( typeof x != 'number' || isNaN(x) )
        this.x = 0;
        if( typeof y != 'number' || isNaN(y) )
        this.y = 0;
        if( typeof w != 'number' || isNaN(w) )
        this.width = 10;
        if( typeof h != 'number' || isNaN(h) )
        this.height = 10;
        
        this.maxc = 25;
        this.leafratio = 0.5;
        if( options ) {
            if( typeof options.maxchildren == 'number' )
                if( options.maxchildren > 0 )
                    this.maxc = options.maxchildren;
            if( typeof options.leafratio == 'number' )
                if( options.leafratio >= 0 )
                    this.leafratio = options.leafratio;
        }
        this.root = QuadTree._createnode(x, y, w, h);
    }

    private static _createnode(x, y, w, h) {
        return {
            x: x,
            y: y,
            width: w,
            height: h,
            //子节点 
            c: [],
            //叶
            l: [],
            //根  4个
            n: []
        }
    }

    private static _validate(obj) {
        if( !obj )
        return false;
        if( typeof obj.x != 'number' ||
            typeof obj.y != 'number' ||
            typeof obj.width != 'number' ||
            typeof obj.height != 'number' )
            return false;
        if( isNaN(obj.x) || isNaN(obj.y) ||
            isNaN(obj.width) || isNaN(obj.height) )
            return false;
        if( obj.width < 0 || obj.height < 0 )
            return false;
        return true;
    }

    private static _isequal(o1, o2) {
        if( o1.x == o2.x &&
            o1.y == o2.y &&
            o1.width == o2.width &&
            o1.height == o2.height )
            return true;
        return false;
    }

    // calculate distance between two points
    private static _distance(x1, y1, x2, y2) {
        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    }
    //计算点与线（段）之间的距离
    // calculate distance between a point and a line (segment)
    private static _distancePL(x, y, x1, y1, dx1, dy1, len1 ) {
        if( !len1 ) // in case length is not provided, assume a line 
            len1 = -1;
        
        // x = x1 + s * dx1 + t * dy1
        // y = y1 + s * dy1 - t * dx1
        // x * dy1 - y * dx1 = x1 * dy1 - y1 * dx1 + 
        //                     t * ( dy1 * dy1 + dx1 * dx1 )
        var t = dx1 * dx1 + dy1 * dy1;
        if( t == 0 )
            return null;
        else {
            t = ( x * dy1 - y * dx1 - x1 * dy1 + y1 * dx1 ) / t;
            if( Math.abs(dx1) > Math.abs(dy1) )
                var s = ( x - x1 - t * dy1 ) / dx1;
            else
                var s = ( y - y1 + t * dx1 ) / dy1;
            if( ( s >= 0 && s <= len1 ) || len1 < 0 )
                return {
                    s: s,
                    t: t,
                    x: x1 + s * dx1,
                    y: y1 + s * dy1,
                    dist: Math.abs(t)
                };
            else if( s < 0 ) { 
                var dist = QuadTree._distance(x, y, x1, y1);
                return {
                    s: s,
                    dist: dist
                };
            } else {
                var dist = QuadTree._distance(x, y,
                                    x1 + len1*dx1, 
                                    y1 + len1*dy1);
                return {
                    s: s,
                    dist: dist
                };
            }
        }
    }
    //直线和矩形是否重叠？
    // does a line and a rectangle overlap ?
    private static _overlap_line(o1, o2, buf) {
        if( !o1 || !o2 )
            return true;
        var dist = QuadTree._distancePL(o2.x + 0.5 * o2.w,
                              o2.y + 0.5 * o2.h,
                              o1.x, o1.y, o1.dx, o1.dy, o1.dist);
        if( dist ) {
            dist.dist -= buf;
            if( dist.dist < 0 )
                return true;
            if( dist.dist * dist.dist <= o2.w * o2.w + o2.h * o2.h )
                return true;
        }
        return false;
    }
     //两个矩形重叠吗？
    // do two rectangles overlap ?
    private static _overlap_rect(o1, o2, buf) {
        if( !o1 || !o2 )
            return true;
        if( o1.x + o1.width < o2.x - buf ||
            o1.y + o1.height < o2.y - buf ||
            o1.x - buf > o2.x + o2.width ||
            o1.y - buf > o2.y + o2.height )
            return false;
        return true;
    }

    private _isleaf(node, obj) {

        var leaf = false;
        if( obj.width * obj.height > node.width * node.height * this.leafratio )
            leaf = true;

        if( obj.x < node.x ||
            obj.y < node.y ||
            obj.x + obj.width > node.x + node.width ||
            obj.y + obj.height > node.y + node.height )
            leaf = true;

        var childnode = null;
        for( var ni = 0; ni < node.n.length; ni++ )
            if( QuadTree._overlap_rect(obj, node.n[ni], 0) ) {
                if( childnode ) { // multiple hits
                    leaf = true;
                    break;
                } else
                    childnode = node.n[ni];
            }
        
        return { leaf: leaf,
                 childnode: childnode };
    }
     //将对象放在该节点的子节点之一
    // put an object to one of the child nodes of this node
    private _put_to_nodes(node, obj) {
        var leaf = this._isleaf(node, obj);
        if( leaf.leaf )
            node.l.push(obj);
        else if( leaf.childnode )
            this._put(leaf.childnode, obj);
        else
            return;
    }
    
    // private static _update_coords(obj, updatedcoords) {
    //     obj.x = ((typeof updatedcoords.x == 'number') ? updatedcoords.x : obj.x);
    //     obj.y = ((typeof updatedcoords.y == 'number') ? updatedcoords.y : obj.y);
    //     obj.width = ((typeof updatedcoords.width == 'number') ? updatedcoords.w : obj.width);
    //     obj.height = ((typeof updatedcoords.height == 'number') ? updatedcoords.h : obj.height);
    // }
    private _update(node, obj) {

       // var count = 0;
        for( var ci = 0; ci < node.c.length; ci++ )
            if( node.c[ci]['id'] == obj['id'] ) {

                // found the object to be updated
                var orig = node.c[ci];
               // QuadTree._update_coords(orig, updatedcoords);
                
                if( orig.x > node.x + node.width ||
                    orig.y > node.y + node.height ||
                    orig.x + orig.w < node.x ||
                    orig.y + orig.h < node.y ) {

                    // this object needs to be removed and added
                    node.c.splice(ci, 1);
                    this._put(this.root, orig);
                } // updated object is still inside same node
                
                return true;
            }
        
        for( var ci = 0; ci < node.l.length; ci++ )
            if( node.l[ci]['id'] == obj['id'] ) {
                
                var orig = node.l[ci];
                //QuadTree._update_coords(orig, updatedcoords);
                
                // found the object to be updated
                if( orig.x > node.x + node.width ||
                    orig.y > node.y + node.height ||
                    orig.x + orig.w < node.x ||
                    orig.y + orig.h < node.y ) {

                    // this object needs to be removed and added 
                    node.l.splice(ci, 1);
                    this._put(this.root, orig);
                } // updated object is still inside same node
                
                return true;
            }

        var leaf = this._isleaf(node, obj);
        if( !leaf.leaf && leaf.childnode )
            if( this._update(leaf.childnode, obj) )
                return true;
        return false;
    }

    // remove an object from this node
    private _remove(node, obj) {
        if( !QuadTree._validate(obj) )
            return 0;

        // if( !attr )
        //     attr = false;
        // else if( typeof attr != 'string' )
        //     attr = 'id';

        var count = 0;
        for( var ci = 0; ci < node.c.length; ci++ )
            if( node.c[ci]['id'] == obj['id'] ) {
                count++;
                node.c.splice(ci, 1);
                ci--;
            }

        for( var ci = 0; ci < node.l.length; ci++ )
            if( node.l[ci]['id'] == obj['id']   ) {
                count++;
                node.l.splice(ci, 1);
                ci--;
            }

        var leaf = this._isleaf(node, obj);
        if( !leaf.leaf && leaf.childnode )
            return count + this._remove(leaf.childnode, obj);
        return count;
    }

    // put an object to this node
    private _put(node, obj) {

        if( !QuadTree._validate(obj) )
            return;

        if( node.n.length == 0 ) {
            node.c.push(obj);
            
            // subdivide
            if( node.c.length > this.maxc ) {
                var w2 = node.width / 2;
                var h2 = node.height / 2;
                node.n.push(QuadTree._createnode(node.x, node.y, w2, h2),
                            QuadTree._createnode(node.x + w2, node.y, w2, h2),
                            QuadTree._createnode(node.x, node.y + h2, w2, h2),
                            QuadTree._createnode(node.x + w2, node.y + h2, w2, h2));
                for( var ci = 0; ci < node.c.length; ci++ ) 
                    this._put_to_nodes(node, node.c[ci]);
                node.c = [];
            }
        } else 
            this._put_to_nodes(node, obj);
    }

    // iterate through all objects in this node matching given overlap
    // function
    private static _getter(overlapfun, node, obj, buf, strict, callbackOrArray) {
        for( var li = 0; li < node.l.length; li++ )
            if( !strict || overlapfun(obj, node.l[li], buf) )
                if( typeof callbackOrArray == 'object' )
                    callbackOrArray.push(node.l[li]);
                else if( !callbackOrArray(node.l[li]) )
                    return false;
        for( var li = 0; li < node.c.length; li++ )
            if( !strict || overlapfun(obj, node.c[li], buf) )
                if( typeof callbackOrArray == 'object' )
                    callbackOrArray.push(node.c[li]);
                else if( !callbackOrArray(node.c[li]) )
                    return false;
        for( var ni = 0; ni < node.n.length; ni++ ) {
            if( overlapfun(obj, node.n[ni], buf) ) {
                if( typeof callbackOrArray == 'object' )
                    callbackOrArray.concat(this._getter(overlapfun, node.n[ni], obj, buf, strict, callbackOrArray));
                else if( !this._getter(overlapfun, node.n[ni], obj, buf, strict, callbackOrArray) )
                    return false;
            }
        }
        return true;
    }

    // iterate through all objects in this node matching the given rectangle
    private static _get_rect(node, obj, buf, callbackOrArray) {
        return QuadTree._getter(QuadTree._overlap_rect, node, obj, buf, true, callbackOrArray);
    }

    // iterate through all objects in this node matching the given
    // line (segment)
    private static _get_line(node, obj, buf, callbackOrArray) {
        return QuadTree._getter(QuadTree._overlap_line, node, obj, buf, false, callbackOrArray);
    }

    // iterate through all objects in this node matching given
    // geometry, either a rectangle or a line segment
    private static _get(node, obj, buf, callbackOrArray) {

        if( (typeof buf == 'function' || typeof buf == 'object') && typeof callbackOrArray == 'undefined' ) {
            callbackOrArray = buf;
            buf = 0;
        }
        if( typeof callbackOrArray == 'undefined' ) {
            callbackOrArray = [];
            buf = 0;
        }
        if( obj == null )
            QuadTree._get_rect(node, obj, buf, callbackOrArray);
        else if( typeof obj.x == 'number' && typeof obj.y == 'number' && !isNaN(obj.x) && !isNaN(obj.y) ) {
            if( typeof obj.dx == 'number' && typeof obj.dy == 'number' && !isNaN(obj.dx) && !isNaN(obj.dy) ){
                QuadTree._get_line(node, obj, buf, callbackOrArray);
            }
            else if( typeof obj.width == 'number' &&  typeof obj.height == 'number' && !isNaN(obj.width) && !isNaN(obj.height) ){
                QuadTree._get_rect(node, obj, buf, callbackOrArray);
            }
        }
        if( typeof callbackOrArray == 'object' ) 
            return callbackOrArray;
    }

    // return the object interface

    public get(obj:T&IQuadRect|IQuadRect, buf?, callbackOrArray?):(T&T&IQuadRect)[] {
        return QuadTree._get(this.root, obj, buf, callbackOrArray);
    };
    public put(obj:T) {
        this._put(this.root, obj);
    };
    /**
     * 
     * @param obj 
     * @param attr 
     * @param updatedcoords 
     */
    public update(obj:T&IQuadRect|IQuadRect) {
        return this._update(this.root, obj);
    };
    public remove(obj:T&IQuadRect|IQuadRect) {
        return this._remove(this.root, obj);
    };
    public clear() {
        this.root = QuadTree._createnode(this.x, this.y, this.width, this.height);
    };
    public stringify() {
        var strobj = {
            x: this.x, y: this.y, w: this.width, h: this.height,
            maxc: this.maxc, 
            leafratio: this.leafratio,
            root: this.root
        };
        try {
            return JSON.stringify(strobj);
        } catch(err) {
            // could not stringify
            // probably due to objects included in qtree being non-stringifiable
            return null; 
        }
    };
    public parse(str:string|any) {
        if( typeof str == 'string' )
            str = JSON.parse(str);
        
        this.x = str.x;
        this.y = str.y;
        this.width = str.w;
        this.height = str.h;
        this.maxc = str.maxc;
        this.leafratio = str.leafratio;
        this.root = str.root;
    };
}

export interface IQuadRect {
        x:number,
        y:number,
        width:number,
        height:number
}

export default QuadTree;