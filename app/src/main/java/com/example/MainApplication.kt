package com.example

import android.app.Application
import android.system.Os

class MainApplication : Application() {

    companion object {
        init {
            try {
                Os.setenv("MESA_DEBUG", "silent", true)
                Os.setenv("MESA_LOG_FILE", "/dev/null", true)
                Os.setenv("MESA_SILENT", "1", true)
                Os.setenv("LIBGL_ALWAYS_SOFTWARE", "1", true)
                Os.setenv("GALLIUM_DRIVER", "llvmpipe", true)
                Os.setenv("EGL_LOG_LEVEL", "fatal", true)
                Os.setenv("DRM_SHIM_DEBUG", "0", true)
            } catch (_: Throwable) {}
        }
    }

    override fun onCreate() {
        super.onCreate()
        try {
            Os.setenv("MESA_DEBUG", "silent", true)
            Os.setenv("MESA_LOG_FILE", "/dev/null", true)
            Os.setenv("MESA_SILENT", "1", true)
            Os.setenv("LIBGL_ALWAYS_SOFTWARE", "1", true)
            Os.setenv("GALLIUM_DRIVER", "llvmpipe", true)
            Os.setenv("EGL_LOG_LEVEL", "fatal", true)
            Os.setenv("DRM_SHIM_DEBUG", "0", true)
        } catch (_: Throwable) {}
    }
}
