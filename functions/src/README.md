FriendKit
====

Customizable & Expandable Game Server base.

Neither Framework nor Library.
----
Think about open-source frameworks. Even though they're customizable because you can access to the code, it will be a huge task.
~

__FriendKit__ is a codebase that operated on __Google Firebase__.

~

Features
----
* __User__
* __Guild__
* __Friend__
* __Message__
* [Inventory](https://github.com/pjc0247/Nventory)
  * will be integrated

API
----

### User Inventory
Provides simple array based inventory with key-value interfaces.

__Add Item__
```ts
user.addItem('sword', 1);
```

__Query Item__
```ts
user.hasItem('sword');
// You can also specify amount of items
user.hasItem('gold', 500);
```

__Consume Item__
```ts
user.consumeItem('sword', 1);
```

__Stash Item__
```ts
user.stashItem('sword');
```