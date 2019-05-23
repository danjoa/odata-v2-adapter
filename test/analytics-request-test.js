'use strict';

const fs = require('fs');
const supertest = require('supertest');

const env = require('./_env');
const util = require('./_env/util');
const init = require('./_env/data/init');

let context;
let request;

describe('analytics-request', () => {
    beforeAll(async () => {
        context = await env('analyticsmodel', 0, init);
        request = supertest(context.app);
    });

    afterAll(() => {
        env.end(context);
    });

    it('GET request with grouping and aggregation', async () => {
        const response = await util.callRead(request, '/v2/analytics/Header?$select=currency,stock');
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({
            d: {
                results: [{
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"currency":"EUR","stock":"25"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    currency: 'EUR',
                    stock: '25'
                }, {
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"currency":"USD","stock":"17"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    currency: 'USD',
                    stock: '17'
                }]
            }
        });
    });

    it('GET request with grouping and aggregating many', async () => {
        const response = await util.callRead(request, '/v2/analytics/Header?$select=country,currency,stock,price');
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({
            d: {
                results: [{
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"country":"Germany","currency":"EUR","stock":"10","price":"12.12"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    country: 'Germany',
                    currency: 'EUR',
                    stock: '10',
                    price: '12.12'
                }, {
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"country":"Spain","currency":"EUR","stock":"15","price":"11.11"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    country: 'Spain',
                    currency: 'EUR',
                    stock: '15',
                    price: '11.11'
                }, {
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"country":"Texas","currency":"USD","stock":"17","price":"10.165000000000001"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    country: 'Texas',
                    currency: 'USD',
                    stock: '17',
                    price: '10.165000000000001'
                }]
            }
        });
    });

    it('GET request with grouping and aggregation and order by', async () => {
        const response = await util.callRead(request, '/v2/analytics/Header?$select=currency,stock&$top=4&$orderby=stock asc');
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({
            d: {
                results: [{
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"currency":"USD","stock":"17"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    currency: 'USD',
                    stock: '17'
                }, {
                    __metadata: {
                        uri: `http://${response.request.host}/v2/analytics/Header(__aggregation__='{"currency":"EUR","stock":"25"}')`,
                        type: '__aggregation__test.AnalyticsService.Header'
                    },
                    currency: 'EUR',
                    stock: '25'
                }]
            }
        });
    });

});
