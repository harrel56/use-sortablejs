import * as path from 'path';
import {chromium, ElementHandle} from 'playwright';
import {Browser, BrowserContext, Page} from 'playwright-core';

const ANIMATION_DURATION = 150

describe('Examples test', () => {
  let browser: Browser;
  let ctx: BrowserContext;
  let page: Page;
  jest.setTimeout(10_000)

  const expectSorted = async (items: ElementHandle<HTMLElement | SVGElement>[], expected: string[]) => {
    const currentPromise = items.map(item => item.textContent())
    const current = await Promise.all(currentPromise)
    expect(current).toEqual(expected)
  }

  const dragAndDrop = async (from: ElementHandle<HTMLElement | SVGElement>, to: ElementHandle<HTMLElement | SVGElement>, steps = 1) => {
    const startBox = (await from.boundingBox())!
    const endBox = (await to.boundingBox())!
    await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(startBox.x + startBox.width / 2 + 5, startBox.y + startBox.height / 2);
    await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2, {steps: steps});
    await page.mouse.up();
    await page.waitForTimeout(ANIMATION_DURATION)
  }

  beforeAll(async () => {
    browser = await chromium.launch({headless: true})
    ctx = await browser.newContext()
    page = await ctx.newPage()
    await page.goto(`file:${path.join(__dirname, '../static/index.html')}`)
  });

  afterAll(() => browser.close());

  it('smoke test: opens html', async () => {
    await page.waitForSelector('.container');
  });

  it('simple list', async () => {
    await page.waitForSelector('#simple-list');

    await page.$eval('#simple-list', el => el.scrollIntoView())
    let items = (await page.$$('#simple-list .item'))!
    await dragAndDrop(items[0], items[1])
    let newItems = (await page.$$('#simple-list .item'))!
    await expectSorted(newItems, ['Item 2', 'Item 1', 'Item 3', 'Item 4', 'Item 5'])

    items = newItems
    await dragAndDrop(items[4], items[0])
    newItems = (await page.$$('#simple-list .item'))!
    await expectSorted(newItems, ['Item 5', 'Item 2', 'Item 1', 'Item 3', 'Item 4'])
  });

  it('shared list', async () => {
    await page.waitForSelector('#shared-list1');
    await page.waitForSelector('#shared-list2');

    await page.$eval('#shared-list1', el => el.scrollIntoView())
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

  it('clone list', async () => {
    await page.waitForSelector('#clone-list1');
    await page.waitForSelector('#clone-list2');

    await page.$eval('#clone-list1', el => el.scrollIntoView())
    let items1 = (await page.$$('#clone-list1 .item'))!
    let items2 = (await page.$$('#clone-list2 .item'))!
    await dragAndDrop(items1[0], items2[2])
    let newItems1 = (await page.$$('#clone-list1 .item'))!
    let newItems2 = (await page.$$('#clone-list2 .item'))!
    await expectSorted(newItems1, ['Item 1', 'Item 2', 'Item 3', 'Item 4'])
    await expectSorted(newItems2, ['Item 1', 'Item 2', 'Item 1', 'Item 3', 'Item 4'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items2[2], items1[0])
    newItems1 = (await page.$$('#clone-list1 .item'))!
    newItems2 = (await page.$$('#clone-list2 .item'))!
    await expectSorted(newItems1, ['Item 1', 'Item 1', 'Item 2', 'Item 3', 'Item 4'])
    await expectSorted(newItems2, ['Item 1', 'Item 2', 'Item 1', 'Item 3', 'Item 4'])

    items1 = newItems1
    await dragAndDrop(items1[0], items1[4])
    newItems1 = (await page.$$('#clone-list1 .item'))!
    await expectSorted(newItems1, ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 1'])
    await expectSorted(newItems2, ['Item 1', 'Item 2', 'Item 1', 'Item 3', 'Item 4'])
  })

  it('handle list', async () => {
    await page.waitForSelector('#handle-list');

    await page.$eval('#handle-list', el => el.scrollIntoView())
    let items = (await page.$$('#handle-list .item'))!
    let handles: ElementHandle<SVGElement | HTMLElement>[]
    await dragAndDrop(items[0], items[2])
    let newItems = (await page.$$('#handle-list .item'))!
    let newHandles = (await page.$$('#handle-list .handle'))!
    await expectSorted(newItems, ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']) // no sorting without handle

    items = newItems
    handles = newHandles
    await dragAndDrop(handles[2], items[0])
    newItems = (await page.$$('#handle-list .item'))!
    newHandles = (await page.$$('#handle-list .handle'))!
    await expectSorted(newItems, ['Item 3', 'Item 1', 'Item 2', 'Item 4', 'Item 5'])

    items = newItems
    handles = newHandles
    await dragAndDrop(handles[1], items[2])
    newItems = (await page.$$('#handle-list .item'))!
    await expectSorted(newItems, ['Item 3', 'Item 2', 'Item 1', 'Item 4', 'Item 5'])
  })

  it('filter list', async () => {
    await page.waitForSelector('#filter-list');

    await page.$eval('#filter-list', el => el.scrollIntoView())
    let items = (await page.$$('#filter-list .item'))!
    await dragAndDrop(items[1], items[4])
    let newItems = (await page.$$('#filter-list .item'))!
    await expectSorted(newItems, ['Item 1', 'Item 3', 'Item 4', 'Filtered', 'Item 2', 'Item 5', 'Item 6'])

    items = newItems
    await dragAndDrop(items[3], items[1])
    newItems = (await page.$$('#filter-list .item'))!
    await expectSorted(newItems, ['Item 1', 'Item 3', 'Item 4', 'Filtered', 'Item 2', 'Item 5', 'Item 6'])

    items = newItems
    await dragAndDrop(items[6], items[3])
    newItems = (await page.$$('#filter-list .item'))!
    await expectSorted(newItems, ['Item 1', 'Item 3', 'Item 4', 'Item 6', 'Filtered', 'Item 2', 'Item 5'])
  });

  it('grid list', async () => {
    await page.waitForSelector('#grid-list');

    await page.$eval('#grid-list', el => el.scrollIntoView())
    let items = (await page.$$('#grid-list .grid-item'))!
    await dragAndDrop(items[0], items[1])
    let newItems = (await page.$$('#grid-list .grid-item'))!
    await expectSorted(newItems, [
      'Item 2', 'Item 1', 'Item 3', 'Item 4', 'Item 5',
      'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10',
      'Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15',
      'Item 16', 'Item 17', 'Item 18', 'Item 19', 'Item 20'
    ])

    items = newItems
    await dragAndDrop(items[19], items[2])
    newItems = (await page.$$('#grid-list .grid-item'))!
    await expectSorted(newItems, [
      'Item 2', 'Item 1', 'Item 20', 'Item 3', 'Item 4', 'Item 5',
      'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10',
      'Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15',
      'Item 16', 'Item 17', 'Item 18', 'Item 19'
    ])

    items = newItems
    await dragAndDrop(items[6], items[12])
    newItems = (await page.$$('#grid-list .grid-item'))!
    await expectSorted(newItems, [
      'Item 2', 'Item 1', 'Item 20', 'Item 3', 'Item 4', 'Item 5',
      'Item 7', 'Item 8', 'Item 9', 'Item 10',
      'Item 11', 'Item 12', 'Item 6', 'Item 13', 'Item 14', 'Item 15',
      'Item 16', 'Item 17', 'Item 18', 'Item 19'
    ])
  });

  it('swap list', async () => {
    await page.waitForSelector('#swap-list1');
    await page.waitForSelector('#swap-list2');

    await page.$eval('#swap-list1', el => el.scrollIntoView())
    let items1 = (await page.$$('#swap-list1 .item'))!
    let items2 = (await page.$$('#swap-list2 .item'))!
    await dragAndDrop(items1[0], items2[0])
    let newItems1 = (await page.$$('#swap-list1 .item'))!
    let newItems2 = (await page.$$('#swap-list2 .item'))!
    await expectSorted(newItems1, ['Item 5', 'Item 2', 'Item 3', 'Item 4'])
    await expectSorted(newItems2, ['Item 1', 'Item 6', 'Item 7', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await dragAndDrop(items2[2], items1[3])
    newItems1 = (await page.$$('#swap-list1 .item'))!
    newItems2 = (await page.$$('#swap-list2 .item'))!
    await expectSorted(newItems1, ['Item 5', 'Item 2', 'Item 3', 'Item 7'])
    await expectSorted(newItems2, ['Item 1', 'Item 6', 'Item 4', 'Item 8'])

    items1 = newItems1
    await dragAndDrop(items1[1], items1[2])
    newItems1 = (await page.$$('#swap-list1 .item'))!
    await expectSorted(newItems1, ['Item 5', 'Item 3', 'Item 2', 'Item 7'])
    await expectSorted(newItems2, ['Item 1', 'Item 6', 'Item 4', 'Item 8'])
  });

  it('multi drag list', async () => {
    const STEPS = 80 // looks like multidrag struggles without intermediate mousemove events
    await page.waitForSelector('#multi-drag-list1');
    await page.waitForSelector('#multi-drag-list2');

    await page.$eval('#multi-drag-list1', el => el.scrollIntoView())
    let items1 = (await page.$$('#multi-drag-list1 .item'))!
    let items2: ElementHandle<SVGElement | HTMLElement>[]
    await items1[0].click()
    await items1[1].click()
    await items1[2].click()
    await dragAndDrop(items1[0], items1[3], STEPS)
    let newItems1 = (await page.$$('#multi-drag-list1 .item'))!
    let newItems2 = (await page.$$('#multi-drag-list2 .item'))!
    await expectSorted(newItems1, ['Item 4', 'Item 1', 'Item 2', 'Item 3'])
    await expectSorted(newItems2, ['Item 5', 'Item 6', 'Item 7', 'Item 8'])

    items1 = newItems1
    await items1[1].click()
    await dragAndDrop(items1[3], items1[0], STEPS)
    newItems1 = (await page.$$('#multi-drag-list1 .item'))!
    newItems2 = (await page.$$('#multi-drag-list2 .item'))!
    await expectSorted(newItems1, ['Item 2', 'Item 3', 'Item 4', 'Item 1'])
    await expectSorted(newItems2, ['Item 5', 'Item 6', 'Item 7', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await items1[2].click()
    await items1[3].click()
    await dragAndDrop(items1[1], items2[1], STEPS)
    newItems1 = (await page.$$('#multi-drag-list1 .item'))!
    newItems2 = (await page.$$('#multi-drag-list2 .item'))!
    await expectSorted(newItems1, [])
    await expectSorted(newItems2, ['Item 5', 'Item 6', 'Item 2', 'Item 3', 'Item 4', 'Item 1', 'Item 7', 'Item 8'])

    let selectedItems = (await page.$$('#multi-drag-list2 .multi-drag'))!
    expect(selectedItems).toEqual([])

    const list1 = (await page.$('#multi-drag-list1'))!
    items2 = newItems2
    await items2[0].click()
    await items2[4].click()
    await dragAndDrop(items2[0], list1, STEPS)
    newItems1 = (await page.$$('#multi-drag-list1 .item'))!
    newItems2 = (await page.$$('#multi-drag-list2 .item'))!
    await expectSorted(newItems1, ['Item 5', 'Item 4'])
    await expectSorted(newItems2, ['Item 6', 'Item 2', 'Item 3', 'Item 1', 'Item 7', 'Item 8'])

    items1 = newItems1
    items2 = newItems2
    await items1[0].click()
    await items1[1].click()
    await items2[1].click()
    selectedItems = (await page.$$('#multi-drag-list2 .multi-drag'))!
    expect(await selectedItems[0].textContent()).toEqual('Item 2')
  });
});
