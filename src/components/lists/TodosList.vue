<template>
<div class="data-list task-list">
  <div style="overflow: hidden">
    <table class="table table-header" ref="headerWrapper">
      <thead>
        <tr>
          <th class="production">
            {{ $t('tasks.fields.production') }}
          </th>
          <th class="type" ref="th-type">
            {{ $t('tasks.fields.task_type') }}
          </th>
          <th class="thumbnail">
          </th>
          <th class="name" ref="th-name">
            {{ $t('tasks.fields.entity') }}
          </th>
          <th class="description">
            {{ $t('assets.fields.description') }}
          </th>
          <th class="estimation">
            {{ $t('tasks.fields.estimation').substring(0, 3) }}.
          </th>
          <th class="estimation">
            {{ $t('tasks.fields.duration').substring(0, 3) }}.
          </th>
          <th class="due-date">
            {{ $t('tasks.fields.due_date') }}
          </th>
          <th class="status">
            {{ $t('tasks.fields.task_status') }}
          </th>
          <th class="last-comment" v-if="!done">
            {{ $t('tasks.fields.last_comment') }}
          </th>
          <th class="end-date" v-else>
            {{ $t('tasks.fields.end_date') }}
          </th>
        </tr>
      </thead>
    </table>
  </div>

  <div
    ref="body"
    class="table-body"
    v-scroll="onBodyScroll"
    v-if="tasks.length > 0"
  >
    <table class="table">
      <tbody ref="body-tbody">
        <tr
          v-for="(entry, i) in displayedTasks"
          :key="entry + '-' + i"
          :class="{
            selected: selectionGrid && selectionGrid[i] ? selectionGrid[i][0] : false
          }"
          @click="onLineClicked(i, $event)"
        >
          <production-name-cell
            class="production"
            :is-tooltip="true"
            :entry="productionMap[entry.project_id]"
            :only-avatar="true"
          />
          <task-type-name
            class="type"
            :production-id="entry.project_id"
            :entry="getTaskType(entry)"
          />
          <td class="thumbnail">
            <entity-thumbnail
              :empty-width="60"
              :empty-height="40"
              :entity="{preview_file_id: entry.entity_preview_file_id}"
            />
          </td>

          <td class="name">
            <router-link :to="entityPath(entry)">
              {{ entry.full_entity_name }}
            </router-link>
          </td>
          <description-cell
            class="description"
            :entry="{description: entry.entity_description}"
          />
          <td class="estimation">
            {{ formatDuration(entry.estimation) }}
          </td>
          <td class="estimation">
            {{ formatDuration(entry.duration) }}
          </td>
          <td class="due-date">
            {{ formatDate(entry.due_date) }}
          </td>
          <validation-cell
            class="status unselectable"
            :ref="'validation-' + i + '-0'"
            :task-test="entry"
            :is-border="false"
            :is-assignees="false"
            :selectable="!done"
            :clickable="false"
            :selected="selectionGrid && selectionGrid[i] ? selectionGrid[i][0] : false"
            :rowX="i"
            :columnY="0"
            @select="onTaskSelected"
            @unselect="onTaskUnselected"
            :column="entry.taskStatus"
          />
          <last-comment-cell
            class="last-comment"
            :task="entry"
            v-if="!done"
          />
          <td class="end-date" v-else>
            {{ formatDate(entry.end_date) }}
          </td>
       </tr>
      </tbody>
    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  />

  <div
    class="has-text-centered empty-list"
    v-if="tasks.length === 0 && !isLoading"
  >
    <p>
      <img src="../../assets/illustrations/empty_todo.png" />
    </p>
    <p>
      {{ $t('people.no_task_assigned') }}
    </p>
  </div>

  <p
    class="has-text-centered footer-info"
    v-if="tasks.length && !isLoading"
  >
    {{ tasks.length }} {{ $tc('tasks.tasks', tasks.length) }}
  </p>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment-timezone'

import EntityThumbnail from '../widgets/EntityThumbnail'
import TaskTypeName from '../cells/TaskTypeName'
import TableInfo from '../widgets/TableInfo'

import DescriptionCell from '../cells/DescriptionCell'
import LastCommentCell from '../cells/LastCommentCell'
import ProductionNameCell from '../cells/ProductionNameCell'
import ValidationCell from '../cells/ValidationCell'
import { selectionListMixin } from './selection'
import { formatListMixin } from './format_mixin'
import { PAGE_SIZE } from '../../lib/pagination'

export default {
  name: 'todos-list',
  mixins: [formatListMixin, selectionListMixin],

  components: {
    EntityThumbnail,
    DescriptionCell,
    LastCommentCell,
    ProductionNameCell,
    TableInfo,
    TaskTypeName,
    ValidationCell
  },

  props: [
    'done',
    'tasks',
    'isLoading',
    'isError',
    'selectionGrid'
  ],

  data () {
    return {
      page: 1
    }
  },

  mounted () {
    this.page = 1
    this.resizeHeaders()
    window.addEventListener('keydown', this.onKeyDown, false)
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
  },

  computed: {
    ...mapGetters([
      'nbSelectedTasks',
      'taskTypeMap',
      'productionMap'
    ]),

    displayedTasks () {
      return this.tasks.slice(0, this.page * PAGE_SIZE)
    }
  },

  methods: {
    ...mapActions([
    ]),

    setScrollPosition (scrollPosition) {
      if (this.$refs.body) {
        this.$refs.body.scrollTop = scrollPosition
      }
    },

    formatDate (date) {
      return date ? moment(date).fromNow() : ''
    },

    onBodyScroll (event, position) {
      this.$refs.headerWrapper.style.left = `-${position.scrollLeft}px`
      this.$emit('scroll', position.scrollTop)
      const maxHeight =
        this.$refs.body.scrollHeight - this.$refs.body.offsetHeight
      if (maxHeight < (position.scrollTop + 100)) {
        this.page++
      }
    },

    onLineClicked (i, event) {
      const ref = 'validation-' + i + '-0'
      const validationCell = this.$refs[ref][0]
      validationCell.select(event)
    },

    onTaskSelected (validationInfo) {
      if (validationInfo.isShiftKey) {
        if (this.lastSelection) {
          let startX = this.lastSelection.x
          let endX = validationInfo.x
          if (validationInfo.x < this.lastSelection.x) {
            startX = validationInfo.x
            endX = this.lastSelection.x
          }

          for (let i = startX; i <= endX; i++) {
            const ref = 'validation-' + i + '-' + 0
            const validationCell = this.$refs[ref][0]
            if (!this.selectionGrid[i][0]) {
              validationCell.select({ ctrlKey: true, isUserClick: false })
            }
          }
        }
      } else if (!validationInfo.isCtrlKey) {
        this.$store.commit('CLEAR_SELECTED_TASKS')
      }
      this.$store.commit('ADD_SELECTED_TASK', validationInfo)

      if (!validationInfo.isShiftKey && validationInfo.isUserClick) {
        const x = validationInfo.x
        const y = 0
        this.lastSelection = { x, y }
        const ref = 'validation-' + x + '-' + y
        const validationCell = this.$refs[ref][0]
        this.$nextTick(() => {
          this.scrollToValidationCell(validationCell)
        })
      }
    },

    onTaskUnselected (validationInfo) {
      if (!validationInfo.isCtrlKey) {
        if (this.nbSelectedTasks === 1) {
          this.$store.commit('REMOVE_SELECTED_TASK', validationInfo)
        } else {
          this.$store.commit('CLEAR_SELECTED_TASKS')
          this.$store.commit('ADD_SELECTED_TASK', validationInfo)
        }
      } else {
        this.$store.commit('REMOVE_SELECTED_TASK', validationInfo)
      }
    },

    getTaskType (entry) {
      const taskType = this.taskTypeMap[entry.task_type_id]
      const production = this.productionMap[entry.project_id]
      taskType.episode_id = entry.episode_id
      if (production && production.production_type === 'tvshow' && !entry.episode_id) {
        taskType.episode_id = production.first_episode_id
      }
      return taskType
    },

    entityPath (entity) {
      const entityType = entity.sequence_name ? 'shot' : 'asset'
      const route = {
        name: entityType,
        params: {
          production_id: entity.project_id
        }
      }

      if (entityType === 'asset') {
        route.params.asset_id = entity.entity_id
      } else {
        route.params.shot_id = entity.entity_id
      }

      const production = this.productionMap[entity.project_id]
      let episodeId = entity.episode_id
      if (production && production.production_type === 'tvshow' && !episodeId) {
        episodeId = production.first_episode_id
      }

      if (episodeId) {
        route.name = `episode-${entityType}`
        route.params.episode_id = episodeId
      }

      return route
    },

    onKeyDown (event) {
      const lastSelection =
        this.lastSelection ? this.lastSelection : { x: 0, y: 0 }
      const i = lastSelection.x
      const j = lastSelection.y
      let validationCell = null
      if (event.ctrlKey) {
        if (event.keyCode === 37) {
          validationCell = this.select(i, j - 1)
        } else if (event.keyCode === 38) {
          validationCell = this.select(i - 1, j)
        } else if (event.keyCode === 39) {
          validationCell = this.select(i, j + 1)
        } else if (event.keyCode === 40) {
          validationCell = this.select(i + 1, j)
        }
        this.scrollToValidationCell(validationCell)
      }
    },

    scrollToValidationCell (validationCell) {
      if (validationCell) {
        const margin = 20
        const rect = validationCell.$el.getBoundingClientRect()
        const listRect = this.$refs.body.getBoundingClientRect()
        const isBelow = rect.bottom > listRect.bottom - margin
        const isAbove = rect.top < listRect.top + margin
        const isRight = rect.right > listRect.right - margin
        const isLeft = rect.left < listRect.left + margin

        if (isBelow) {
          const scrollingRequired = rect.bottom - listRect.bottom + margin
          this.setScrollPosition(
            this.$refs.body.scrollTop + scrollingRequired
          )
        } else if (isAbove) {
          const scrollingRequired = listRect.top - rect.top + margin
          this.setScrollPosition(
            this.$refs.body.scrollTop - scrollingRequired
          )
        }

        if (isRight) {
          const scrollingRequired = rect.right - listRect.right + margin
          this.setScrollLeftPosition(
            this.$refs.body.scrollLeft + scrollingRequired
          )
        } else if (isLeft) {
          const scrollingRequired = listRect.left - rect.left + margin
          this.setScrollLeftPosition(
            this.$refs.body.scrollLeft - scrollingRequired
          )
        }
      }
    },

    select (i, j) {
      const ref = 'validation-' + i + '-' + j
      const validationCell = this.$refs[ref]
      if (validationCell) validationCell[0].$el.click()
      return validationCell ? validationCell[0] : 0
    },

    resizeHeaders () {
      const tableBody = this.$refs['body-tbody']
      const isTableBodyContainLines = tableBody && tableBody.children
      if (isTableBodyContainLines) {
        const bodyElement = tableBody.children[0]
        const columnDescriptors = [
          { index: 1, name: 'type' },
          { index: 3, name: 'name' }
        ]
        columnDescriptors.forEach(desc => {
          const width = Math.max(
            bodyElement.children[desc.index].offsetWidth,
            100
          )
          this.$refs['th-' + desc.name].style['min-width'] = `${width}px`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  width: 230px;
  min-width: 230px;
}

.description {
  width: 200px;
  min-width: 200px;
}

.description li {
  list-style-type: disc;
  margin-left: 2em;
}

.name a {
  color: inherit;
}

.production {
  width: 70px;
  min-width: 70px;
  max-width: 70px;
}

.type {
  width: 130px;
  min-width: 130px;
}

.status {
  width: 90px;
  min-width: 90px;
}

.estimation {
  width: 60px;
  min-width: 60px;
}

.due-date {
  width: 110px;
  min-width: 110px;
}

th.last-comment {
 max-width: 100%;
 width: 100%;
}

td.last-comment {
  min-width: 250px;
}

.end-date {
  width: 100%;
  min-width: 150px;
  color: $grey;
}

.thumbnail {
  min-width: 60px;
  max-width: 60px;
  width: 60px;
  padding: 0;
}

.empty-list img {
  max-width: 80vh;
}

.table-body .table tr.selected,
.table-body .table tr.selected:hover {
  background-color: #D1C4E9;
}

.table-body .table tr {
  cursor: pointer;
  user-select: none;
}
.table-body .table tr:hover {
  background: #CCFFCC;
}

.dark {
  .table-body .table tr.selected,
  .table-body .table tr.selected:hover {
    background: #5E60BA;
  }

  .table-body .table tr {
    &:hover {
      background: #878B97;
    }
  }
}
</style>
