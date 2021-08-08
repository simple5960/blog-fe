export default function serviceWorker(swPath)
{
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function (event) {
            navigator.serviceWorker.register(swPath, {
                    scope: '/'
                })
                .then(function (registeration) {
                    console.log('Service worker register success with scope ' + registeration.scope);
                });
        });

        navigator.serviceWorker.oncontrollerchange = function (event) {
            console.log('service worker版本已更新');
        };

        // 如果用户处于断网状态进入页面，用户可能无法感知内容是过期，需要提示用户断网了，并在重新连接后告诉用户
        if (!window.navigator.onLine) {

            window.addEventListener('online', function () {
            });

        }
    }
}