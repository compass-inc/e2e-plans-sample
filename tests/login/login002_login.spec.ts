import { test, expect } from '@playwright/test';

test.describe('ログイン機能のテスト', () => {
  test('正常なログインの確認', async ({ page }) => {
    // 1. ページにアクセス
    await page.goto('/');

    // タイトルとURLの確認
    await expect(page).toHaveTitle('Qubena(キュビナ)');
    expect(page.url()).toBe('https://nanboku.dev.moge.app/');

    // 1. 学校選択
    const schoolCombobox = page.getByRole('combobox', { name: '学校（がっこう）' });
    await schoolCombobox.click();
    await page.keyboard.type('き');  // 「き」を入力して北から始まる学校を表示
    await page.getByText('北中学校', { exact: true }).click();

    // 2. ログイン情報入力
    await page.getByRole('textbox', { name: 'ID（アイディー）' }).fill('n020202');
    await page.getByRole('textbox', { name: 'パスワード' }).fill('hoge1234');

    // ログインボタンの有効化を確認
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true }).first();
    await expect(loginButton).toBeEnabled();

    // 3. ログイン実行
    await loginButton.click();

    // ログイン後の確認
    // 1. ダッシュボードページへの遷移
    await expect(page).toHaveURL('https://nanboku.dev.moge.app/home');
    await expect(page).toHaveTitle('Qubena(キュビナ)');

    // 2. ユーザー情報の表示
    await expect(page.getByText('中2')).toBeVisible();
    await expect(page.getByText('宮田 俊平')).toBeVisible();

    // 3. メインメニューの表示
    const menuItems = [
      'ホーム',
      'ワークブック',
      '学習りれき',
      '5分間復習',
      'メクビット',
      '設定'
    ];

    // デバッグ: ページ内の全要素とそのロールを表示
    console.log('Available roles on page:');
    const elements = await page.$$('*[role]');
    for (const element of elements) {
      const role = await element.getAttribute('role');
      const text = await element.textContent();
      console.log(`Role: ${role}, Text: ${text}`);
    }

    // メニュー項目の存在を確認
    for (const item of menuItems) {
      // MuiTypographyクラスを持つ要素の最初の出現を確認
      await expect(page.locator(`p.MuiTypography-root:has-text("${item}")`).first()).toBeVisible();
    }

    // テスト終了時のログアウト
    await page.goto('/setting');
    const logoutButton = page.getByRole('button', { name: 'ログアウト' });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 確認ダイアログが表示されるまで待機
    await page.waitForLoadState('networkidle');
    const confirmLogoutButton = page.getByRole('button', { name: 'ログアウト' }).last();
    await expect(confirmLogoutButton).toBeVisible();
    await confirmLogoutButton.click();

    // ログアウト後の確認
    await expect(page).toHaveURL('https://nanboku.dev.moge.app/');
    await expect(page.getByRole('textbox', { name: 'ID（アイディー）' })).toBeVisible();
  });

  test('ログインボタンの有効化条件', async ({ page }) => {
    // 1. ページにアクセス
    await page.goto('/');

    // 初期状態でログインボタンが無効であることを確認
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true }).first();
    await expect(loginButton).toBeDisabled();

    // 学校のみ選択
    const schoolCombobox = page.getByRole('combobox', { name: '学校（がっこう）' });
    await schoolCombobox.click();
    await page.keyboard.type('き');
    await page.getByText('北中学校', { exact: true }).click();
    await expect(loginButton).toBeDisabled();

    // IDのみ入力
    await page.getByRole('textbox', { name: 'ID（アイディー）' }).fill('n020202');
    await expect(loginButton).toBeDisabled();

    // パスワードのみ入力
    await page.getByRole('textbox', { name: 'ID（アイディー）' }).clear();
    await page.getByRole('textbox', { name: 'パスワード' }).fill('hoge1234');
    await expect(loginButton).toBeDisabled();

    // すべての項目を入力
    await page.getByRole('textbox', { name: 'ID（アイディー）' }).fill('n020202');
    await expect(loginButton).toBeEnabled();
  });
}); 