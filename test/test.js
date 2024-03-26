'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('PVR constructor test', () => {
    it('should have one node', () => {
        var config = {
            width: 800,
            height: 600,
            backgroundColor: '#000000',
            duration: 10,
            fps: 30,
        };
        var result = index.PVR(config);
        result.addChild({ x: 50, y: 50, width: 50, height: 50 });
        expect(result).to.have.property('children').with.lengthOf(1);
    });
});