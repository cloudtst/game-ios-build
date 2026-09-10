
import UIKit
import WebKit

final class GameViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private let dpad = UIView()
    private let actions = UIView()

    override var prefersStatusBarHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .allButUpsideDown }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        buildWebView()
        buildControls()
        loadGame()
    }

    private func buildWebView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.preferences.javaScriptCanOpenWindowsAutomatically = true

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    private func loadGame() {
        let game = Bundle.main.url(forResource: "Game/index", withExtension: "html")!
        webView.loadFileURL(game, allowingReadAccessTo: Bundle.main.url(forResource: "Game", withExtension: nil)!)
    }

    private func buildControls() {
        configureContainer(dpad)
        configureContainer(actions)
        view.addSubview(dpad)
        view.addSubview(actions)

        let up = button("▲", key: "ArrowUp")
        let down = button("▼", key: "ArrowDown")
        let left = button("◀", key: "ArrowLeft")
        let right = button("▶", key: "ArrowRight")
        add(up, to: dpad); add(down, to: dpad); add(left, to: dpad); add(right, to: dpad)

        let a = button("A", key: "KeyZ")
        let b = button("B", key: "KeyX")
        let menu = button("☰", key: "Escape")
        let enter = button("↵", key: "Enter")
        add(a, to: actions); add(b, to: actions); add(menu, to: actions); add(enter, to: actions)

        NSLayoutConstraint.activate([
            dpad.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            dpad.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            dpad.widthAnchor.constraint(equalToConstant: 180),
            dpad.heightAnchor.constraint(equalToConstant: 180),

            actions.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            actions.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            actions.widthAnchor.constraint(equalToConstant: 180),
            actions.heightAnchor.constraint(equalToConstant: 180)
        ])

        // D-pad layout
        NSLayoutConstraint.activate([
            up.centerXAnchor.constraint(equalTo: dpad.centerXAnchor),
            up.topAnchor.constraint(equalTo: dpad.topAnchor),
            up.widthAnchor.constraint(equalToConstant: 58), up.heightAnchor.constraint(equalToConstant: 58),
            down.centerXAnchor.constraint(equalTo: dpad.centerXAnchor),
            down.bottomAnchor.constraint(equalTo: dpad.bottomAnchor),
            down.widthAnchor.constraint(equalToConstant: 58), down.heightAnchor.constraint(equalToConstant: 58),
            left.centerYAnchor.constraint(equalTo: dpad.centerYAnchor),
            left.leadingAnchor.constraint(equalTo: dpad.leadingAnchor),
            left.widthAnchor.constraint(equalToConstant: 58), left.heightAnchor.constraint(equalToConstant: 58),
            right.centerYAnchor.constraint(equalTo: dpad.centerYAnchor),
            right.trailingAnchor.constraint(equalTo: dpad.trailingAnchor),
            right.widthAnchor.constraint(equalToConstant: 58), right.heightAnchor.constraint(equalToConstant: 58)
        ])

        NSLayoutConstraint.activate([
            a.trailingAnchor.constraint(equalTo: actions.trailingAnchor),
            a.topAnchor.constraint(equalTo: actions.topAnchor, constant: 20),
            a.widthAnchor.constraint(equalToConstant: 72), a.heightAnchor.constraint(equalToConstant: 72),
            b.leadingAnchor.constraint(equalTo: actions.leadingAnchor, constant: 12),
            b.topAnchor.constraint(equalTo: actions.topAnchor, constant: 72),
            b.widthAnchor.constraint(equalToConstant: 64), b.heightAnchor.constraint(equalToConstant: 64),
            menu.trailingAnchor.constraint(equalTo: actions.trailingAnchor),
            menu.bottomAnchor.constraint(equalTo: actions.bottomAnchor),
            menu.widthAnchor.constraint(equalToConstant: 54), menu.heightAnchor.constraint(equalToConstant: 54),
            enter.leadingAnchor.constraint(equalTo: actions.leadingAnchor),
            enter.bottomAnchor.constraint(equalTo: actions.bottomAnchor),
            enter.widthAnchor.constraint(equalToConstant: 54), enter.heightAnchor.constraint(equalToConstant: 54)
        ])
    }

    private func configureContainer(_ v: UIView) {
        v.translatesAutoresizingMaskIntoConstraints = false
        v.backgroundColor = .clear
        v.isUserInteractionEnabled = true
    }

    private func add(_ v: UIView, to parent: UIView) {
        parent.addSubview(v)
    }

    private func button(_ title: String, key: String) -> UIButton {
        let b = UIButton(type: .system)
        b.setTitle(title, for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 25, weight: .bold)
        b.setTitleColor(.white, for: .normal)
        b.backgroundColor = UIColor.black.withAlphaComponent(0.48)
        b.layer.cornerRadius = 29
        b.layer.borderWidth = 1
        b.layer.borderColor = UIColor.white.withAlphaComponent(0.35).cgColor
        b.accessibilityLabel = title
        b.translatesAutoresizingMaskIntoConstraints = false

        let down = UIControl.Event.touchDown
        let up = UIControl.Event.touchUpInside.union(.touchUpOutside).union(.touchCancel)
        b.addAction(UIAction { [weak self] _ in self?.sendKey(key, down: true) }, for: down)
        b.addAction(UIAction { [weak self] _ in self?.sendKey(key, down: false) }, for: up)
        return b
    }

    private func sendKey(_ code: String, down: Bool) {
        let js = """
        (function(){
          var t = \(down ? "'keydown'" : "'keyup'");
          var e = new KeyboardEvent(t,{key:'\(code)',code:'\(code)',bubbles:true,cancelable:true});
          var k = {'ArrowUp':38,'ArrowDown':40,'ArrowLeft':37,'ArrowRight':39,'KeyZ':90,'KeyX':88,'Escape':27,'Enter':13}['\(code)'] || 0;
          try { Object.defineProperty(e,'keyCode',{get:function(){return k;}}); Object.defineProperty(e,'which',{get:function(){return k;}}); } catch(x) {}
          document.dispatchEvent(e);
          window.dispatchEvent(e);
        })();
        """
        webView.evaluateJavaScript(js, completionHandler: nil)
    }
}
