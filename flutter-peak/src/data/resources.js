export const resources = [
  {
    id: 'install-guide',
    title: "Flutter Installation Guide 🛠️",
    description: "Step-by-step guide to install Flutter on Windows, macOS, Ubuntu, and Arch Linux",
    type: "documentation",
    link: "#",
    difficulty: "beginner",
    onClick: () => window.showModal('install')
  },
  {
    id: 'flutter-3-27',
    title: "Flutter 3.27 What's New",
    description: "Latest features and improvements in Flutter 3.27 with Impeller, Cupertino Updates, and More",
    type: "documentation",
    link: "https://medium.com/flutter/whats-new-in-flutter-3-27-28341129570c",
    difficulty: "intermediate"
  },
  {
    id: 'dart-basics',
    title: "Dart Programming Fundamentals",
    description: "Master the Dart programming language basics with interactive examples",
    type: "tutorial",
    link: "https://dart.dev/guides/language/language-tour",
    difficulty: "beginner"
  },
  {
    id: 'flutter-widgets',
    title: "Flutter Widget Catalog",
    description: "Comprehensive guide to Flutter widgets with examples and best practices",
    type: "documentation",
    link: "https://docs.flutter.dev/ui/widgets",
    difficulty: "beginner"
  },
  {
    id: 'state-management',
    title: "State Management in Flutter",
    description: "Learn different state management approaches in Flutter applications",
    type: "tutorial",
    link: "https://docs.flutter.dev/data-and-backend/state-mgmt/intro",
    difficulty: "intermediate"
  },
  {
    id: 'riverpod',
    title: "Riverpod State Management",
    description: "Modern state management solution for Flutter applications",
    type: "tutorial",
    link: "https://riverpod.dev/docs/introduction/getting_started",
    difficulty: "intermediate"
  },
  {
    id: 'bloc-pattern',
    title: "BLoC Pattern",
    description: "Business Logic Component pattern implementation in Flutter",
    type: "tutorial",
    link: "https://bloclibrary.dev/#/gettingstarted",
    difficulty: "advanced"
  },
  {
    id: 'animations',
    title: "Flutter Animations",
    description: "Create smooth and beautiful animations in Flutter",
    type: "tutorial",
    link: "https://docs.flutter.dev/ui/animations",
    difficulty: "intermediate"
  },
  {
    id: 'responsive-design',
    title: "Responsive Design",
    description: "Build adaptive and responsive Flutter apps for all screen sizes",
    type: "tutorial",
    link: "https://docs.flutter.dev/ui/layout/adaptive-responsive",
    difficulty: "intermediate"
  },
  {
    id: 'testing',
    title: "Testing Flutter Apps",
    description: "Learn unit, widget, and integration testing in Flutter",
    type: "documentation",
    link: "https://docs.flutter.dev/testing",
    difficulty: "intermediate"
  },
  {
    id: 'firebase',
    title: "Firebase Integration",
    description: "Integrate Firebase services into your Flutter applications",
    type: "tutorial",
    link: "https://firebase.google.com/docs/flutter/setup",
    difficulty: "intermediate"
  },
  {
    id: 'supabase',
    title: "Supabase with Flutter",
    description: "Build Flutter apps with Supabase backend",
    type: "tutorial",
    link: "https://supabase.com/docs/guides/getting-started/quickstarts/flutter",
    difficulty: "intermediate"
  },
  {
    id: 'appwrite',
    title: "Appwrite Backend",
    description: "Integrate Appwrite backend services in Flutter",
    type: "tutorial",
    link: "https://appwrite.io/docs/quick-starts/flutter",
    difficulty: "intermediate"
  },
  {
    id: 'custom-paint',
    title: "Custom Painting in Flutter",
    description: "Create custom graphics and animations using CustomPainter",
    type: "tutorial",
    link: "https://api.flutter.dev/flutter/rendering/CustomPainter-class.html",
    difficulty: "advanced"
  },
  {
    id: 'internationalization',
    title: "Flutter Internationalization",
    description: "Add multi-language support to your Flutter applications",
    type: "documentation",
    link: "https://docs.flutter.dev/ui/accessibility-and-localization/internationalization",
    difficulty: "intermediate"
  },
  {
    id: 'performance',
    title: "Performance Optimization",
    description: "Optimize your Flutter app for better performance",
    type: "documentation",
    link: "https://docs.flutter.dev/perf",
    difficulty: "advanced"
  },
  {
    id: 'desktop',
    title: "Flutter Desktop Development",
    description: "Build cross-platform desktop applications with Flutter",
    type: "tutorial",
    link: "https://docs.flutter.dev/desktop",
    difficulty: "advanced"
  },
  {
    id: 'game-dev',
    title: "Flutter Game Development",
    description: "Create games with Flutter using the Flame engine",
    type: "tutorial",
    link: "https://docs.flame-engine.org/latest/",
    difficulty: "advanced"
  },
  {
    id: 'architecture',
    title: "Flutter App Architecture",
    description: "Learn clean architecture patterns for Flutter applications",
    type: "tutorial",
    link: "https://verygood.ventures/blog/very-good-flutter-architecture",
    difficulty: "advanced"
  },
  {
    id: 'flutter-web',
    title: "Flutter Web Development",
    description: "Build and deploy web applications with Flutter",
    type: "tutorial",
    link: "https://docs.flutter.dev/platform-integration/web",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-hooks',
    title: "Flutter Hooks",
    description: "Use hooks in Flutter for better state management and code reuse",
    type: "tutorial",
    link: "https://pub.dev/packages/flutter_hooks",
    difficulty: "intermediate"
  },
  {
    id: 'go-router',
    title: "GoRouter Navigation",
    description: "Modern declarative routing solution for Flutter",
    type: "tutorial",
    link: "https://pub.dev/packages/go_router",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-rust',
    title: "Flutter + Rust",
    description: "Integrate Rust with Flutter for high-performance features",
    type: "tutorial",
    link: "https://flutter.dev/docs/development/platform-integration/rust",
    difficulty: "advanced"
  },
  {
    id: 'flutter-ml',
    title: "Machine Learning in Flutter",
    description: "Implement ML features using TensorFlow Lite and Flutter",
    type: "tutorial",
    link: "https://www.tensorflow.org/lite/guide/flutter",
    difficulty: "advanced"
  },
  {
    id: 'flutter-ar',
    title: "AR with Flutter",
    description: "Build Augmented Reality experiences using ARKit and ARCore",
    type: "tutorial",
    link: "https://pub.dev/packages/arkit_plugin",
    difficulty: "advanced"
  },
  {
    id: 'flutter-animations-advanced',
    title: "Advanced Animations",
    description: "Create complex animations using Rive and Lottie",
    type: "tutorial",
    link: "https://rive.app/flutter",
    difficulty: "advanced"
  },
  {
    id: 'flutter-clean-code',
    title: "Clean Code Practices",
    description: "Best practices for writing maintainable Flutter code",
    type: "documentation",
    link: "https://github.com/flutter/flutter/wiki/Style-guide-for-Flutter-repo",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-testing-advanced',
    title: "Advanced Testing",
    description: "Advanced testing techniques including BDD and integration testing",
    type: "tutorial",
    link: "https://flutter.dev/docs/cookbook/testing",
    difficulty: "advanced"
  },
  {
    id: 'flutter-ci-cd',
    title: "CI/CD for Flutter",
    description: "Set up continuous integration and deployment for Flutter apps",
    type: "tutorial",
    link: "https://docs.codemagic.io/flutter-configuration/flutter-projects/",
    difficulty: "advanced"
  },
  {
    id: 'flutter-ffi',
    title: "Flutter FFI",
    description: "Call native C/C++ code from Flutter using FFI",
    type: "tutorial",
    link: "https://flutter.dev/docs/development/platform-integration/c-interop",
    difficulty: "advanced"
  },
  {
    id: 'flutter-graphql',
    title: "GraphQL in Flutter",
    description: "Implement GraphQL APIs in Flutter applications",
    type: "tutorial",
    link: "https://pub.dev/packages/graphql_flutter",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-websocket',
    title: "WebSocket Integration",
    description: "Real-time communication using WebSockets in Flutter",
    type: "tutorial",
    link: "https://pub.dev/packages/web_socket_channel",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-maps',
    title: "Maps Integration",
    description: "Implement Google Maps and location services in Flutter",
    type: "tutorial",
    link: "https://pub.dev/packages/google_maps_flutter",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-payments',
    title: "Payment Integration",
    description: "Implement various payment gateways in Flutter apps",
    type: "tutorial",
    link: "https://stripe.com/docs/stripe-sdk/flutter",
    difficulty: "intermediate"
  },
  {
    id: 'flutter-accessibility',
    title: "Accessibility in Flutter",
    description: "Make your Flutter apps accessible to everyone",
    type: "documentation",
    link: "https://docs.flutter.dev/development/accessibility-and-localization/accessibility",
    difficulty: "intermediate"
  }
];
