import './AudioContext'
import * as Utils from '../src/js/utils/app.util'

describe('Util tests', () => {
	describe('scale', () => {
		it('-96(dB) should be scaled to 50(%)', () => {
			const scaled = Utils.scale(-96, -192, 0, 0, 100);
			expect(scaled).toBe(50);
		})
    
		it('0 should be scaled to 50(%) in a range of -150 to 150.', () => {
			const scaled = Utils.scale(0, -150, 150, 0, 100);
			expect(scaled).toBe(50)
		})
	})

	describe('dBToPercent', () => {
		it('-96(dB) should be converted to 50(%)', () => {
			const converted = Utils.dBToPercent(-96);
			expect(converted).toBe(50)
		})
	})

	describe('percentTodB', () => {
		it('50(%) should be converted to -96(dB).', () => {
			const converted = Utils.percentTodB(50);
			expect(converted).toBe(-96)
		})
	})
})
