import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import i18n from '../../../src/lib/i18n'
import ShowAssignationsButton from '../../../src/components/widgets/ShowAssignationsButton'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('ShowAssignationsButton', () => {
  let actions
  let state
  let store
  let mutations
  let getters
  let wrapper

  beforeEach(() => {
    state = {
      isShowAssignations: true
    }

    mutations = {
      toggleState (state) {
        state.isShowAssignations = !state.isShowAssignations
      }
    }

    actions = {
      showAssignations: jest.fn(),
      hideAssignations: jest.fn()
    }

    getters = {
      isShowAssignations: state => state.isShowAssignations
    }

    store = new Vuex.Store({
      strict: true,
      modules: {
        tasks: {
          actions,
          state,
          mutations,
          getters
        }
      }
    })

    wrapper = shallowMount(ShowAssignationsButton, {
      localVue,
      store,
      i18n
    })
  })

  describe('Mount', () => {
    it('should be On', () => {
      expect(wrapper.element.getAttribute('title')).toMatch('Hide assignations')
    })

    it('should trigger a function on click', () => {
      const button = wrapper.find('button')
      button.trigger('click')
      expect(actions.hideAssignations).toHaveBeenCalled()
    })

    it('should be Off', () => {
      store.commit('toggleState')
      expect(wrapper.element.getAttribute('title')).toMatch('Show assignations')
    })
  })
})
