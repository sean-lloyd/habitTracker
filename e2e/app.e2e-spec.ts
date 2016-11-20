import { HabitTrackerPage } from './app.po';

describe('habit-tracker App', function() {
  let page: HabitTrackerPage;

  beforeEach(() => {
    page = new HabitTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
