export class Matrix2D {
    public m11: number;
    public m12: number;
    public m13: number;
    public m21: number;
    public m22: number;
    public m23: number;

    /**
    * Defines a matrix used for 2D transformations.
    * 
    * @param m11
    * @param m12
    * @param m13
    * @param m21
    * @param m22
    * @param m23
    */
    constructor(m11: number = 0, m12: number = 0, m13: number = 0, m21: number = 0, m22: number = 0, m23: number = 0) {
        // NB: These matrix are 3x2 matrixes posing as 3x3 matrices whose (m31, m32, m33) values are always (0, 0, 1)
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
    }

    /**
     * Computes the result of the multiplication of the matrix with another matrix.
     * @param other - The other matrix
     */
    public multiply(other: Matrix2D): Matrix2D {
        return Matrix2D.multiply(this, other);
    }

    /**
     * Returns the determinant of the matrix.
     */
    public determinant(): number {
        return this.m11 * this.m22 - this.m12 * this.m21;
    }

    /**
     * Computes the inverse matrix.
     */
    public inverse(): Matrix2D {
        var det = this.determinant();

        if (det === 0) return null;

        var c = 1 / det;

        return new Matrix2D(
            c * this.m22, -c * this.m12, c * (this.m12 * this.m23 - this.m22 * this.m13),
            -c * this.m21, c * this.m11, -c * (this.m11 * this.m23 - this.m21 * this.m13)
        );
    }

    /**
     * Creates an identity matrix.
     */
    public static identity(): Matrix2D {
        return new Matrix2D(1, 0, 0, 0, 1, 0);
    }

    /**
     * Creates a scaling matrix.
     * @param s - Scale factor
     */
    public static scale(s: number): Matrix2D;
    /**
     * Creates a scaling matrix.
     * @param sx - Horizontal scale factor
     * @param sy - Vertical scale factor
     */
    public static scale(sx: number, sy: number): Matrix2D;

    public static scale(sx: number = 1, sy: number = sx): Matrix2D {
        return new Matrix2D(sx, 0, 0, 0, sy, 0);
    }

    /**
     * Creates a translation matrix.
     * @param t - Horizontal and vertical translation
     */
    public static translate(t: number): Matrix2D;
    /**
     * Creates a translation matrix.
     * @param tx - Horizontal translation
     * @param ty - Vertical translation
     */
    public static translate(tx: number, ty: number): Matrix2D;

    public static translate(tx: number = 0, ty: number = tx): Matrix2D {
        return new Matrix2D(1, 0, tx, 0, 1, ty);
    }

    /**
     * Creates a clockwise rotation matrix.
     * @param a - Angle of rotation in radians.
     */
    public static rotate(a: number): Matrix2D {
        return new Matrix2D(Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0);
    }

    /**
     * Returns the result of the multiplication of two matrices.
     * @param a - First matrix
     * @param b - Second matrix
     */
    public static multiply(a: Matrix2D, b: Matrix2D): Matrix2D {
        return new Matrix2D(
            b.m11 * a.m11 + b.m12 * a.m21,
            b.m11 * a.m12 + b.m12 * a.m22,
            b.m11 * a.m13 + b.m12 * a.m23 + b.m13,
            b.m21 * a.m11 + b.m22 * a.m21,
            b.m21 * a.m12 + b.m22 * a.m22,
            b.m21 * a.m13 + b.m22 * a.m23 + b.m23
        );
    }
}

export class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }

    public scale(s: number): Vector2D;
    public scale(sx: number, sy: number): Vector2D;
    public scale(sx: number = 0, sy: number = sx): Vector2D {
        return new Vector2D(this.x * sx, this.y * sy);
    }

    public translate(t: number): Vector2D;
    public translate(tx: number, ty: number): Vector2D;
    public translate(tx: number = 0, ty: number = tx): Vector2D {
        return new Vector2D(this.x + tx , this.y + ty);
    }

    public floor(): Vector2D {
        return new Vector2D(Math.floor(this.x), Math.floor(this.y));
    }

    public ceil(): Vector2D {
        return new Vector2D(Math.ceil(this.x), Math.ceil(this.y));
    }

    public round(): Vector2D {
        return new Vector2D(Math.round(this.x), Math.round(this.y));
    }

    public frac(): Vector2D {
        return new Vector2D(this.x % 1, this.y % 1);
    }

    public wrap(): Vector2D {
        return new Vector2D(_fracToPositive(this.x % 1), _fracToPositive(this.y % 1));
    }

    public multiply(v: Vector2D): Vector2D {
        return new Vector2D(this.x * v.x, this.y * v.y);
    }

    public negate(): Vector2D {
        return new Vector2D(-this.x, -this.y);
    }

    public add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    public transform(m: Matrix2D) {
        return new Vector2D(
            this.x * m.m11 + this.y * m.m12 + m.m13,
            this.x * m.m21 + this.y * m.m22 + m.m23
        );
    }

    public static zero(): Vector2D {
        return new Vector2D(0, 0);
    }
}

/**
 * Helper method to remap a fractional part in [0; 1[
 * @param f - The number to remap.
 */
function _fracToPositive(f: number) { return f < 0 ? f + 1 : f; }