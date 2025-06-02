import { test, expect } from '@playwright/test';

test.describe('ログインページのテスト', () => {
  test('基本的な表示要素の確認', async ({ page }) => {
    // 1. ページにアクセス
    await page.goto('/');

    // デバッグ: ページ全体のテキストを取得
    const bodyText = await page.textContent('body');
    console.log('Page text:', bodyText);

    // タイトルとURLの確認
    await expect(page).toHaveTitle('Qubena(キュビナ)');
    expect(page.url()).toBe('https://nanboku.dev.moge.app/');

    // ログインフォームの要素確認
    await expect(page.getByRole('combobox', { name: '学校（がっこう）' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'ID（アイディー）' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'パスワード' })).toBeVisible();

    // ログインボタンの確認（初期状態で無効）
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true }).first();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeDisabled();

    // 外部認証オプションの確認
    await expect(page.getByRole('button', { name: 'Googleでログイン' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Microsoftでログイン' })).toBeVisible();

    // デバッグ: ページ上のすべてのリンクを表示
    const links = await page.getByRole('link').all();
    console.log('Found links:');
    for (const link of links) {
      const text = await link.textContent();
      console.log(`- ${text}`);
    }

    // その他の情報確認
    await expect(page.getByText('動作環境')).toBeVisible();

    // ビルド情報の表示確認
    const buildInfo = page.getByText(/build : .+/);
    await expect(buildInfo).toBeVisible();
  });

  test('ページ表示のパフォーマンス', async ({ page }) => {
    // 1秒以内にページが表示されることを確認
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThanOrEqual(1000);
    await expect(page.getByRole('button', { name: 'ログイン', exact: true }).first()).toBeVisible();
  });
}); 