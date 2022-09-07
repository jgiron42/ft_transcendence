/* eslint-disable max-classes-per-file */
import { checkIntersection } from "line-intersect";
import { SegmentInterface, TwoDimensionalInterface } from "../types/geometry";

class Point implements TwoDimensionalInterface {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	equals(other: Point): boolean {
		return (
			other.x - 0.01 <= this.x && this.x <= other.x + 0.01 && other.y - 0.01 <= this.y && this.y <= other.y + 0.01
		);
	}
}

class Segment implements SegmentInterface {
	p1: TwoDimensionalInterface;
	p2: TwoDimensionalInterface;

	constructor(p1: Point, p2: Point) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

const getIntersectionPoint = (s1: Readonly<Segment>, s2: Readonly<Segment>): Point | undefined => {
	const res = checkIntersection(s1.p1.x, s1.p1.y, s1.p2.x, s1.p2.y, s2.p1.x, s2.p1.y, s2.p2.x, s2.p2.y);

	if (res.type !== "intersecting") return undefined;

	return new Point(res.point.x, res.point.y);
};

const getIntersectionPointTest = () => {
	const A = new Point(-9.94, 4.56) as Readonly<Point>;
	const B = new Point(-7.26, 3) as Readonly<Point>;
	const f = new Segment(A, B) as Readonly<Segment>;
	const C = new Point(-7.48, 4.92) as Readonly<Point>;
	const D = new Point(-9.48, 2.76) as Readonly<Point>;
	const g = new Segment(C, D) as Readonly<Segment>;
	const E = new Point(1.44, 1.38) as Readonly<Point>;
	const F = new Point(5.72, 1.76) as Readonly<Point>;
	const h = new Segment(E, F) as Readonly<Segment>;
	const G = new Point(1, 2) as Readonly<Point>;
	const H = new Point(5.68, 0.96) as Readonly<Point>;
	const i = new Segment(G, H) as Readonly<Segment>;
	const I = new Point(4.64, -2.64) as Readonly<Point>;
	const J = new Point(3.84, -6.22) as Readonly<Point>;
	const j = new Segment(I, J) as Readonly<Segment>;
	const K = new Point(3.04, -2.62) as Readonly<Point>;
	const L = new Point(5.52, -6) as Readonly<Point>;
	const k = new Segment(K, L) as Readonly<Segment>;
	const M = new Point(6.54, -4.32) as Readonly<Point>;
	const N = new Point(11.18, -4.34) as Readonly<Point>;
	const l = new Segment(M, N) as Readonly<Segment>;
	const O = new Point(10.8, -4.02) as Readonly<Point>;
	const P = new Point(6.52, -4.66) as Readonly<Point>;
	const m = new Segment(O, P) as Readonly<Segment>;
	const Q = new Point(-11.44, -3.6) as Readonly<Point>;
	const R = new Point(-11.5, -9.16) as Readonly<Point>;
	const n = new Segment(Q, R) as Readonly<Segment>;
	const S = new Point(-13.68, -6.04) as Readonly<Point>;
	const T = new Point(-9.38, -6.08) as Readonly<Point>;
	const p = new Segment(S, T) as Readonly<Segment>;

	const U = new Point(3.11, 1.53) as Readonly<Point>;
	const V = new Point(4.27, -4.3) as Readonly<Point>;
	const W = new Point(8.73, -4.33) as Readonly<Point>;
	const Z = new Point(-8.56, 3.76) as Readonly<Point>;
	const B1 = new Point(-11.47, -6.06) as Readonly<Point>;

	// [Segment1, Segment2, ExpectedResult]
	const intersectingSegments: [Segment, Segment, Point][] = [
		[f, g, Z],
		[h, i, U],
		[n, p, B1],
		[j, k, V],
		[m, l, W],
	];

	// [Segment1, Segment2]
	const nonIntersectingSegments: [Segment, Segment][] = [
		[f, h],
		[g, p],
		[h, n],
		[n, j],
		[p, l],
		[j, m],
		[m, k],
	];

	intersectingSegments.forEach((params) => {
		const expectedResult = params[2];
		const result = getIntersectionPoint(params[0], params[1]);
		const resultInverse = getIntersectionPoint(params[1], params[0]);

		// eslint-disable-next-line
		console.log("got:", result, "exp:", expectedResult);
		if (!result || !resultInverse || !result.equals(expectedResult) || !resultInverse.equals(expectedResult))
			throw new Error(`getIntersectinSegmentsTest(): wrong result for ${JSON.stringify(params)}`);
	});

	nonIntersectingSegments.forEach((params) => {
		const expectedResult: Point | undefined = undefined;
		const result = getIntersectionPoint(params[0], params[1]);
		const resultInverse = getIntersectionPoint(params[1], params[0]);

		// eslint-disable-next-line
		console.log("got:", result, "exp:", expectedResult);
		if (result || resultInverse)
			throw new Error(`getIntersectinSegmentsTest(): wrong result for ${JSON.stringify(params)}`);
	});
};

if (require.main === module) getIntersectionPointTest();

export default getIntersectionPoint;

export { getIntersectionPoint };
