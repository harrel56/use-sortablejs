import * as path from 'path';
import {chromium, ElementHandle} from 'playwright';
import {Browser, BrowserContext, Page} from 'playwright-core';

const ANIMATION_DURATION = 150

describe('Examples test', () => {
  let browser: Browser;
  let ctx: BrowserContext;
  let page: Page;
  jest.setTimeout(60_000)

  const expectSorted = async (items: ElementHandle<HTMLElement | SVGElement>[], expected: string[]) => {
    const currentPromise = items.map(item => item.textContent())
    const current = await Promise.all(currentPromise)
    expect(current).toEqual(expected)
  }

  const dragAndDrop = async (from: ElementHandle<HTMLElement | SVGElement>, to: ElementHandle<HTMLElement | SVGElement>) => {
    const startBox = (await from.boundingBox())!
    const endBox = (await to.boundingBox())!
    await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
    await page.mouse.up();
    await page.waitForTimeout(ANIMATION_DURATION)
  }

  beforeAll(async () => {
    browser = await chromium.launch({headless: false})
    ctx = await browser.newContext()
    page = await ctx.newPage()
    await page.goto(`file:${path.join(__dirname, '../examples/static/index.html')}`)
  });

  afterAll(() => browser.close());

  it('smoke test: opens html', async () => {
    await page.waitForSelector('.container');
  });

  it('simple list sorting', async () => {
    await page.waitForSelector('#simple-list');

    let items = (await page.$$('#simple-list .item'))!
    await dragAndDrop(items[0], items[1])
    let newItems = (await page.$$('#simple-list .item'))!
    await expectSorted(newItems, ['Item 2', 'Item 1', 'Item 3', 'Item 4', 'Item 5'])

    items = newItems
    await dragAndDrop(items[4], items[0])
    newItems = (await page.$$('#simple-list .item'))!
    await expectSorted(newItems, ['Item 5', 'Item 2', 'Item 1', 'Item 3', 'Item 4'])
  });

  it('shared list sorting', async () => {
    await page.waitForSelector('#shared-list1');
    await page.waitForSelector('#shared-list2');

    let items1 = (await page.$$('#shared-list1 .item'))!
    let items2 = (await page.$$('#shared-list2 .item'))!
    await dragAndDrop(items1[0], items2[2])
    let newItems1 = (await page.$$('#shared-list1 .item'))!
    let newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, ['Item 2', 'Item 3', 'Item 4'])
    await expectSorted(newItems2, ['Item 5', 'Item 6', 'Item 1', 'Item 7', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items1[2], items2[0])
    newItems1 = (await page.$$('#shared-list1 .item'))!
    newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, ['Item 2', 'Item 3'])
    await expectSorted(newItems2, ['Item 4', 'Item 5', 'Item 6', 'Item 1', 'Item 7', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items1[0], items2[5])
    newItems1 = (await page.$$('#shared-list1 .item'))!
    newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, ['Item 3'])
    await expectSorted(newItems2, ['Item 4', 'Item 5', 'Item 6', 'Item 1', 'Item 7', 'Item 2', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items1[0], items2[0])
    newItems1 = (await page.$$('#shared-list1 .item'))!
    newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, [])
    await expectSorted(newItems2, ['Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 1', 'Item 7', 'Item 2', 'Item 8'])

    let list1 = (await page.$('#shared-list1'))!
    items2 = newItems2
    await dragAndDrop(items2[7], list1)
    newItems1 = (await page.$$('#shared-list1 .item'))!
    newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, ['Item 8'])
    await expectSorted(newItems2, ['Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 1', 'Item 7', 'Item 2'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items2[4], items1[0])
    newItems1 = (await page.$$('#shared-list1 .item'))!
    newItems2 = (await page.$$('#shared-list2 .item'))!
    await expectSorted(newItems1, ['Item 1', 'Item 8'])
    await expectSorted(newItems2, ['Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 2'])
  });

});