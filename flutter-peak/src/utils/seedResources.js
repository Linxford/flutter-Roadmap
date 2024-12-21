import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resources = [
  {
    title: "Flutter Official Documentation",
    description: "The official Flutter documentation covering all aspects of the framework",
    type: "documentation",
    difficulty: "beginner",
    link: "https://docs.flutter.dev",
    category: "fundamentals",
    tags: ["official", "documentation", "basics"]
  },
  {
    title: "Dart Programming Language Tour",
    description: "A comprehensive guide to the Dart programming language",
    type: "documentation",
    difficulty: "beginner",
    link: "https://dart.dev/guides/language/language-tour",
    category: "language",
    tags: ["dart", "basics", "syntax"]
  },
  {
    title: "Flutter Widget Catalog",
    description: "Comprehensive list of Flutter widgets with examples",
    type: "documentation",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/development/ui/widgets",
    category: "widgets",
    tags: ["widgets", "ui", "reference"]
  },
  {
    title: "Flutter State Management Guide",
    description: "Different approaches to state management in Flutter",
    type: "tutorial",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/development/data-and-backend/state-mgmt/options",
    category: "state-management",
    tags: ["state", "provider", "riverpod", "bloc"]
  },
  {
    title: "Flutter Layout Cheat Sheet",
    description: "Quick reference for Flutter layouts and widgets",
    type: "documentation",
    difficulty: "beginner",
    link: "https://medium.com/flutter-community/flutter-layout-cheat-sheet-5363348d037e",
    category: "layout",
    tags: ["layout", "widgets", "ui"]
  },
  {
    title: "Flutter App Architecture",
    description: "Best practices for structuring Flutter applications",
    type: "tutorial",
    difficulty: "advanced",
    link: "https://verygood.ventures/blog/very-good-flutter-architecture",
    category: "architecture",
    tags: ["architecture", "best-practices", "clean-code"]
  },
  {
    title: "Flutter Testing Guide",
    description: "Comprehensive guide to testing Flutter applications",
    type: "documentation",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/testing",
    category: "testing",
    tags: ["testing", "unit-tests", "widget-tests", "integration-tests"]
  },
  {
    title: "Flutter Performance Best Practices",
    description: "Tips and techniques for optimizing Flutter apps",
    type: "tutorial",
    difficulty: "advanced",
    link: "https://docs.flutter.dev/perf/rendering/best-practices",
    category: "performance",
    tags: ["performance", "optimization", "best-practices"]
  },
  {
    title: "Flutter Animation Tutorial",
    description: "Learn to create beautiful animations in Flutter",
    type: "tutorial",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/development/ui/animations/tutorial",
    category: "animations",
    tags: ["animations", "ui", "motion"]
  },
  {
    title: "Flutter Firebase Integration",
    description: "Guide to integrating Firebase with Flutter",
    type: "tutorial",
    difficulty: "intermediate",
    link: "https://firebase.flutter.dev/docs/overview/",
    category: "backend",
    tags: ["firebase", "backend", "authentication"]
  },
  {
    title: "Flutter REST API Integration",
    description: "Working with REST APIs in Flutter applications",
    type: "tutorial",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/development/data-and-backend/networking",
    category: "networking",
    tags: ["api", "networking", "http"]
  },
  {
    title: "Flutter Design Patterns",
    description: "Common design patterns implemented in Flutter",
    type: "course",
    difficulty: "advanced",
    link: "https://flutterdesignpatterns.com/",
    category: "patterns",
    tags: ["design-patterns", "architecture", "best-practices"]
  },
  {
    title: "Flutter Responsive Design",
    description: "Creating responsive and adaptive Flutter applications",
    type: "tutorial",
    difficulty: "intermediate",
    link: "https://docs.flutter.dev/development/ui/layout/adaptive-responsive",
    category: "layout",
    tags: ["responsive", "adaptive", "layout"]
  },
  {
    title: "Flutter State Management with Provider",
    description: "Deep dive into state management using Provider",
    type: "course",
    difficulty: "intermediate",
    link: "https://pub.dev/packages/provider",
    category: "state-management",
    tags: ["provider", "state", "management"]
  },
  {
    title: "Flutter BLoC Pattern",
    description: "Understanding and implementing the BLoC pattern",
    type: "course",
    difficulty: "advanced",
    link: "https://bloclibrary.dev/",
    category: "state-management",
    tags: ["bloc", "state", "patterns"]
  }
];

export const seedResources = async () => {
  try {
    const resourcesCollection = collection(db, 'resources');

    for (const resource of resources) {
      await addDoc(resourcesCollection, {
        ...resource,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        completions: 0,
        ratings: {
          count: 0,
          total: 0,
          average: 0
        }
      });
    }

    console.log('Resources seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding resources:', error);
    return false;
  }
};
