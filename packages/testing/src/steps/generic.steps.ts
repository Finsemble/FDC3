import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { expect } from 'expect';
import { doesRowMatch, handleResolve, matchData } from '../support/matching';
import { PropsWorld } from '../world';

export function setupGenericSteps() {

    When('the promise {string} should resolve', async function (this: PropsWorld, field: string) {
        try {
            const promise = handleResolve(field, this)
            const object = await promise
            this.props['result'] = object
        } catch (error) {
            this.props['result'] = error
        }
    })

    When('I call {string} with {string}', async function (this: PropsWorld, field: string, fnName: string) {
        try {
            const object = handleResolve(field, this)
            const fn = object[fnName];
            const result = await fn.call(object)
            this.props['result'] = result;
        } catch (error) {
            this.props['result'] = error
        }
    })

    When('I call {string} with {string} with parameter {string}', async function (this: PropsWorld, field: string, fnName: string, param: string) {
        try {
            const object = handleResolve(field, this)
            const fn = object[fnName];
            const result = await fn.call(object, handleResolve(param, this))
            this.props['result'] = result;
        } catch (error) {
            this.props['result'] = error
        }
    })

    When('I call {string} with {string} with parameters {string} and {string}', async function (this: PropsWorld, field: string, fnName: string, param1: string, param2: string) {
        try {
            const object = handleResolve(field, this)
            const fn = object[fnName];
            const result = await fn.call(object, handleResolve(param1, this), handleResolve(param2, this))
            this.props['result'] = result;
        } catch (error) {
            this.props['result'] = error
        }
    });

    When('I call {string} with {string} with parameters {string} and {string} and {string}', async function (this: PropsWorld, field: string, fnName: string, param1: string, param2: string, param3: string) {
        try {
            const object = handleResolve(field, this)
            const fn = object[fnName];
            const result = await fn.call(object, handleResolve(param1, this), handleResolve(param2, this), handleResolve(param3, this))
            this.props['result'] = result;
        } catch (error) {
            this.props['result'] = error
        }
    });

    When('I refer to {string} as {string}', async function (this: PropsWorld, from: string, to: string) {
        this.props[to] = handleResolve(from, this);
    })

    Then('{string} is an array of objects with the following contents', function (this: PropsWorld, field: string, dt: DataTable) {
        matchData(this, handleResolve(field, this), dt)
    });

    Then('{string} is an array of strings with the following values', function (this: PropsWorld, field: string, dt: DataTable) {
        const values = handleResolve(field, this).map((s: string) => { return { "value": s } })
        matchData(this, values, dt)
    });

    Then('{string} is an object with the following contents', function (this: PropsWorld, field: string, params: DataTable) {
        const table = params.hashes()
        expect(doesRowMatch(this, table[0], handleResolve(field, this))).toBeTruthy();
    });

    Then('{string} is null', function (this: PropsWorld, field: string) {
        expect(handleResolve(field, this)).toBeNull()
    })

    Then('{string} is not null', function (this: PropsWorld, field: string) {
        expect(handleResolve(field, this)).toBeDefined()
    })


    Then('{string} is undefined', function (this: PropsWorld, field: string) {
        expect(handleResolve(field, this)).toBeUndefined()
    })

    Then('{string} is empty', function (this: PropsWorld, field: string) {
        expect(handleResolve(field, this)).toHaveLength(0)
    })

    Then('{string} is {string}', function (this: PropsWorld, field: string, expected: string) {
        const fVal = handleResolve(field, this)
        const eVal = handleResolve(expected, this)
        expect("" + fVal).toEqual("" + eVal)
    })

    Then('{string} is an error with message {string}', function (this: PropsWorld, field: string, errorType: string) {
        expect(handleResolve(field, this)['message']).toBe(errorType)
    })

    Given('{string} is a invocation counter into {string}', function (this: PropsWorld, handlerName: string, field: string) {
        this.props[handlerName] = () => {
            var amount: number = this.props[field]
            amount++;
            this.props[field] = amount
        }
        this.props[field] = 0;
    })

    Given('{string} is a function which returns a promise of {string}', function (this: PropsWorld, fnName: string, field: string) {
        const value = handleResolve(field, this)
        this.props[fnName] = async () => {
            return value
        }
    })

    Given('we wait for a period of {string} ms', function (this: PropsWorld, ms: string) {
        return new Promise<void>((resolve, _reject) => {
            setTimeout(() => resolve(), parseInt(ms))
        })
    });
}
