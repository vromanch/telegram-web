
function MtpSingleInstanceService(_, $rootScope, $compile, $modalStack, Storage, AppRuntimeManager, IdleManager, ErrorService, MtpNetworkerFactory) {
    var instanceID = nextRandomInt(0xFFFFFFFF)
    var started = false
    var masterInstance = false
    var deactivatePromise = false
    var deactivated = false
    var initial = false

    function start () {
      if (!started && !Config.Navigator.mobile && !Config.Modes.packed) {
        started = true

        IdleManager.start()

        $rootScope.$watch('idle.isIDLE', checkInstance)
        setInterval(checkInstance, 5000)
        checkInstance()

        try {
          $($window).on('beforeunload', clearInstance)
        } catch (e) {}
      }
    }

    function clearInstance () {
      if (masterInstance && !deactivated) {
        console.warn('clear master instance');
        Storage.remove('xt_instance')
      }
    }

    function deactivateInstance () {
      if (masterInstance || deactivated) {
        return false
      }
      console.log(dT(), 'deactivate')
      deactivatePromise = false
      deactivated = true
      clearInstance()
      $modalStack.dismissAll()

      document.title = _('inactive_tab_title_raw')

      var inactivePageCompiled = $compile('<ng-include src="\'partials/desktop/inactive.html\'"></ng-include>')

      var scope = $rootScope.$new(true)
      scope.close = function () {
        AppRuntimeManager.close()
      }
      scope.reload = function () {
        AppRuntimeManager.reload()
      }
      inactivePageCompiled(scope, function (clonedElement) {
        $('.page_wrap').hide()
        $(clonedElement).appendTo($('body'))
      })
      $rootScope.idle.deactivated = true
    }

    function checkInstance () {
      if (deactivated) {
        return false
      }
      var time = tsNow()
      var idle = $rootScope.idle && $rootScope.idle.isIDLE
      var newInstance = {id: instanceID, idle: idle, time: time}

      Storage.get('xt_instance').then(function (curInstance) {
        // console.log(dT(), 'check instance', newInstance, curInstance)
        if (!idle ||
            !curInstance ||
            curInstance.id == instanceID ||
            curInstance.time < time - 20000) {
          Storage.set({xt_instance: newInstance})
          if (!masterInstance) {
            MtpNetworkerFactory.startAll()
            if (!initial) {
              initial = true
            } else {
              console.warn(dT(), 'now master instance', newInstance)
            }
            masterInstance = true
          }
          if (deactivatePromise) {
            clearTimeoutPromise(deactivatePromise)
            deactivatePromise = false
          }
        } else {
          if (masterInstance) {
            MtpNetworkerFactory.stopAll()
            console.warn(dT(), 'now idle instance', newInstance)
            if (!deactivatePromise) {
              deactivatePromise = setTimeoutPromise(deactivateInstance, 30000)
            }
            masterInstance = false
          }
        }
      })
    }

    return {
      start: start
    }
}