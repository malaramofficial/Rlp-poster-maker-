package com.rlp.postermaker

import android.app.Activity
import android.graphics.*
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.*
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {
    private lateinit var preview: ImageView
    private var userBitmap: Bitmap? = null
    private val posterW = 1080
    private val posterH = 1350

    private val picker = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let {
            userBitmap = MediaStore.Images.Media.getBitmap(contentResolver, it)
            render()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(24,24,24,24) }
        root.addView(TextView(this).apply { text = "RLP Poster Maker"; textSize = 26f })
        preview = ImageView(this).apply { adjustViewBounds = true; minimumHeight = 700; scaleType = ImageView.ScaleType.FIT_CENTER }
        root.addView(preview, LinearLayout.LayoutParams(-1,0,1f))

        val name = EditText(this).apply { hint = "अपना नाम" }
        val place = EditText(this).apply { hint = "ग्राम पंचायत / स्थान" }
        root.addView(name); root.addView(place)

        val buttons = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        val photo = Button(this).apply { text = "PNG फोटो चुनें"; setOnClickListener { picker.launch("image/*") } }
        val update = Button(this).apply { text = "पोस्टर अपडेट"; setOnClickListener { render(name.text.toString(), place.text.toString()) } }
        buttons.addView(photo, LinearLayout.LayoutParams(0,-2,1f)); buttons.addView(update, LinearLayout.LayoutParams(0,-2,1f))
        root.addView(buttons)
        root.addView(Button(this).apply { text = "FULL HD सेव करें"; setOnClickListener { savePoster(name.text.toString(), place.text.toString()) } })
        setContentView(root)
        render()
    }

    private fun render(name:String="", place:String="") {
        val b = createPoster(name, place)
        preview.setImageBitmap(b)
    }

    private fun createPoster(name:String, place:String):Bitmap {
        val b=Bitmap.createBitmap(posterW,posterH,Bitmap.Config.ARGB_8888)
        val c=Canvas(b)
        c.drawColor(Color.rgb(245,245,245))
        val red=Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.rgb(210,30,30) }
        c.drawRect(0f,0f,posterW.toFloat(),180f,red)
        val text=Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.WHITE; textAlign=Paint.Align.CENTER; typeface=Typeface.DEFAULT_BOLD }
        text.textSize=64f; c.drawText("राष्ट्रीय लोकतांत्रिक पार्टी",540f,95f,text)
        text.textSize=36f; c.drawText("RLP POSTER MAKER",540f,145f,text)

        userBitmap?.let { src ->
            val size=470
            val dst=Rect(305,240,305+size,240+size)
            c.drawBitmap(src,null,dst,null)
        }
        val dark=Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.rgb(30,30,30); textAlign=Paint.Align.CENTER; typeface=Typeface.DEFAULT_BOLD }
        dark.textSize=62f; c.drawText(if(name.isBlank()) "आपका नाम" else name,540f,850f,dark)
        dark.textSize=38f; c.drawText(if(place.isBlank()) "ग्राम पंचायत / स्थान" else place,540f,915f,dark)
        dark.textSize=34f; c.drawText("जनता की आवाज • मजबूत राजस्थान",540f,1260f,dark)
        return b
    }

    private fun savePoster(name:String, place:String) {
        val b=createPoster(name,place)
        val dir=File(getExternalFilesDir(null),"posters").apply { mkdirs() }
        val f=File(dir,"RLP_Poster_"+System.currentTimeMillis()+".png")
        FileOutputStream(f).use { b.compress(Bitmap.CompressFormat.PNG,100,it) }
        Toast.makeText(this,"पोस्टर सेव हुआ: "+f.absolutePath,Toast.LENGTH_LONG).show()
    }
}