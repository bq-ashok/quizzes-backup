import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Collection from 'quizzes-addon/models/collection/collection';
import ContextResult from 'quizzes-addon/models/result/context';
import ResourceResult from 'quizzes-addon/models/result/resource';
import ResourceModel from 'quizzes-addon/models/resource/resource';
import Ember from 'ember';

const profileServiceStub = Ember.Service.extend({
  readProfiles(data) {
    if (data) {
      return Ember.RSVP.resolve({
        'profile-id1': Ember.Object.create({
          firstName: 'first-name',
          id: 'profile-id1',
          lastName: 'last-name',
          username: 'author-username',
          email: 'e@mail.com',
          avatarUrl: '/avatar-url.png'
        }),
        'profile-id2': Ember.Object.create({
          firstName: 'first-name',
          id: 'profile-id2',
          lastName: 'last-name',
          username: 'username',
          email: 'e@mail.com'
        })
      });
    } else {
      return Ember.RSVP.resolve({});
    }
  }
});

moduleForComponent(
  'player/qz-player',
  'Integration | Component | player/qz player',
  {
    integration: true,
    beforeEach: function() {
      this.inject.service('i18n');
      this.register('service:quizzes/profile', profileServiceStub);
      this.inject.service('quizzes/profile');
    }
  }
);

test('it renders', function(assert) {
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false
  });
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  this.set('contextResult', contextResult);
  this.render(hbs`{{player/qz-player contextResult=contextResult}}`);
  var $component = this.$();
  assert.ok(
    $component.find('.qz-player').length,
    'Assessment component should appear'
  );
});

test('Show finish Confirmation', function(assert) {
  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Assessment Title',
    isCollection: false,
    hasResources: true
  });
  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' }
    }
  );
  this.set('contextResult', contextResult);
  this.set('showFinishConfirmation', true);
  this.set('showConfirmation', false);
  this.render(
    hbs`{{player/qz-player contextResult=contextResult showConfirmation=showConfirmation showFinishConfirmation=showFinishConfirmation}}`
  );
  var $component = this.$();
  assert.ok(
    $component.find('.qz-submit-confirmation').length,
    'Submit confirmation should appear'
  );
});

test('Narration', function(assert) {
  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    format: 'question',
    isQuestion: true,
    narration: 'narration for test',
    hasOwner: true
  });

  const resourceMockB = ResourceModel.create({
    id: '2',
    body: 'http://www.water4all.org/us/',
    isResource: true,
    narration: 'narration for test',
    hasOwner: true
  });

  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true,
    resources: Ember.A([resourceMockA, resourceMockB]),
    ownerId: 'profile-id1'
  });

  const resourceResults = Ember.A([
    ResourceResult.create({ resource: resourceMockA, resourceId: '1' }),
    ResourceResult.create({ resource: resourceMockB, resourceId: '2' })
  ]);

  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' },
      currentResource: resourceMockB,
      resourceResults
    }
  );
  const resourceResult = ResourceResult.create({ resource: resourceMockB });

  this.set('resourceResult', resourceResult);
  this.set('contextResult', contextResult);
  this.render(
    hbs`{{player/qz-player contextResult=contextResult resourceResult=resourceResult}}`
  );
  var $component = this.$();
  assert.ok(
    $component.find('.qz-player .qz-viewer .qz-resource-viewer .narration')
      .length,
    'Missing narration'
  );
  assert.ok(
    $component.find(
      '.qz-player .qz-viewer .qz-resource-viewer .narration .avatar'
    ).length,
    'Missing avatar'
  );
  assert.equal(
    $component
      .find('.qz-player .qz-viewer .qz-resource-viewer .narration .avatar img')
      .attr('src'),
    '/avatar-url.png',
    'Incorrect avatar'
  );
  assert.ok(
    $component.find(
      '.qz-player .qz-viewer .qz-resource-viewer .narration .user'
    ).length,
    'Missing username'
  );
  assert.equal(
    $component
      .find('.qz-player .qz-viewer .qz-resource-viewer .narration .user')
      .text(),
    'author-username',
    'Incorrect username'
  );
});

test('Link out', function(assert) {
  const resourceMockA = Ember.Object.create({
    id: '1',
    title: '<p>Resource #1</p>',
    format: 'question',
    isQuestion: true,
    narration: 'narration for test',
    hasOwner: true,
    ownerId: 'profile-id1',
    displayGuide: {
      is_broken: 1,
      is_frame_breaker: 1
    }
  });

  const resourceMockB = ResourceModel.create({
    id: '2',
    body: 'http://www.water4all.org/us/',
    isResource: true,
    narration: 'narration for test',
    hasOwner: true,
    ownerId: 'profile-id1',
    displayGuide: {
      is_broken: 1,
      is_frame_breaker: 1
    }
  });

  const collection = Collection.create(Ember.getOwner(this).ownerInjection(), {
    title: 'Collection Title',
    isCollection: true,
    resources: Ember.A([resourceMockA, resourceMockB]),
    ownerId: 'profile-id1'
  });

  const resourceResults = Ember.A([
    ResourceResult.create({ resource: resourceMockA, resourceId: '1' }),
    ResourceResult.create({ resource: resourceMockB, resourceId: '2' })
  ]);

  const contextResult = ContextResult.create(
    Ember.getOwner(this).ownerInjection(),
    {
      contextId: 'context',
      collection,
      context: { id: 'context-id', attempts: '2' },
      currentResource: resourceMockB,
      resourceResults
    }
  );
  const resourceResult = ResourceResult.create({ resource: resourceMockB });

  this.set('resourceResult', resourceResult);
  this.set('contextResult', contextResult);
  this.render(
    hbs`{{player/qz-player contextResult=contextResult resourceResult=resourceResult}}`
  );
  var $component = this.$();
  assert.ok(
    $component.find('.qz-player .qz-viewer .qz-resource-viewer .not-iframe')
      .length,
    'Missing link out panel'
  );
  assert.ok(
    $component.find(
      '.qz-player .qz-viewer .qz-resource-viewer .not-iframe .qz-resource-card'
    ).length,
    'Missing link out resource card'
  );
  assert.ok(
    $component.find(
      '.qz-player .qz-viewer .qz-resource-viewer .not-iframe .qz-resource-card .publisher'
    ).length,
    'Missing publisher section'
  );
  assert.equal(
    $component
      .find(
        '.qz-player .qz-viewer .qz-resource-viewer .not-iframe .qz-resource-card .publisher img'
      )
      .attr('src'),
    '/avatar-url.png',
    'Missing publisher image'
  );
  assert.equal(
    $component
      .find(
        '.qz-player .qz-viewer .qz-resource-viewer .not-iframe .qz-resource-card .publisher .owner'
      )
      .text()
      .trim(),
    'author-username',
    'Incorrect username'
  );
});
