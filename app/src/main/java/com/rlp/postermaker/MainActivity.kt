package com.rlp.postermaker

import android.graphics.*
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.Gravity
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.FileOutputStream

data class PosterTemplate(val id:Int,val title:String,val subtitle:String)

class MainActivity : AppCompatActivity() {
    private lateinit var preview: ImageView
    private lateinit var nameInput: EditText
    private lateinit var placeInput: EditText
    private lateinit var templateBar: LinearLayout
    private var userBitmap: Bitmap? = null
    private var selected = 0
    private val templates = listOf(
        PosterTemplate(0,"जनसभा पोस्टर","जनता की आवाज • मजबूत राजस्थान"),
        PosterTemplate(1,"शुभकामना पोस्टर","आप सभी को हार्दिक शुभकामनाएं"),
        PosterTemplate(2,"युवा शक्ति","युवा • किसान • आमजन"),
        PosterTemplate(3,"विशेष संदेश","राजस्थान की मजबूत आवाज")
    )
    private val picker = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let { userBitmap = MediaStore.Images.Media.getBitmap(contentResolver,it); render() }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val scroll=ScrollView(this)
        val root=LinearLayout(this).apply { orientation=LinearLayout.VERTICAL; setPadding(24,24,24,24) }
        scroll.addView(root)

        root.addView(TextView(this).apply {
            text="RLP Poster Maker"; textSize=28f; gravity=Gravity.CENTER
        })
        root.addView(TextView(this).apply {
            text="अपना टेम्पलेट चुनें, फोटो और जानकारी जोड़ें"; gravity=Gravity.CENTER
        })

        val hs=HorizontalScrollView(this)
        templateBar=LinearLayout(this).apply { orientation=LinearLayout.HORIZONTAL }
        hs.addView(templateBar)
        root.addView(hs)
        buildTemplates()

        preview=ImageView(this).apply { adjustViewBounds=true; minimumHeight=650; scaleType=ImageView.ScaleType.FIT_CENTER }
        root.addView(preview,LinearLayout.LayoutParams(-1,-2))

        nameInput=EditText(this).apply { hint="अपना नाम / पदनाम" }
        placeInput=EditText(this).apply { hint="ग्राम पंचायत / स्थान" }
        root.addView(nameInput); root.addView(placeInput)

        val row=LinearLayout(this).apply { orientation=LinearLayout.HORIZONTAL }
        row.addView(Button(this).apply { text="फोटो चुनें"; setOnClickListener { picker.launch("image/*") } },LinearLayout.LayoutParams(0,-2,1f))
        row.addView(Button(this).apply { text="अपडेट"; setOnClickListener { render() } },LinearLayout.LayoutParams(0,-2,1f))
        root.addView(row)
        root.addView(Button(this).apply { text="FULL HD PNG सेव करें"; setOnClickListener { savePoster() } })
        setContentView(scroll); render()
    }

    private fun buildTemplates() {
        templates.forEachIndexed { index,t ->
            templateBar.addView(Button(this).apply {
                text=t.title
                setOnClickListener { selected=index; render() }
            })
        }
    }

    private fun render(){ preview.setImageBitmap(createPoster()) }

    private fun createPoster():Bitmap {
        val w=1080; val h=1350
        val b=Bitmap.createBitmap(w,h,Bitmap.Config.ARGB_8888); val c=Canvas(b)
        val accent=when(selected){0->Color.rgb(205,35,35);1->Color.rgb(235,120,25);2->Color.rgb(20,90,60);else->Color.rgb(70,55,130)}
        c.drawColor(Color.rgb(248,246,242))
        val p=Paint(Paint.ANTI_ALIAS_FLAG)
        p.color=accent; c.drawRect(0f,0f,w.toFloat(),190f,p)
        c.drawRect(0f,1190f,w.toFloat(),1350f,p)
        val title=Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.WHITE;textAlign=Paint.Align.CENTER;typeface=Typeface.DEFAULT_BOLD;textSize=64f }
        c.drawText("राष्ट्रीय लोकतांत्रिक पार्टी",540f,92f,title)
        title.textSize=34f; c.drawText(templates[selected].title,540f,145f,title)

        val frame=Paint(Paint.ANTI_ALIAS_FLAG).apply { style=Paint.Style.STROKE;strokeWidth=14f;color=accent }
        c.drawCircle(540f,510f,245f,frame)
        userBitmap?.let { src ->
            val path=Path().apply { addCircle(540f,510f,232f,Path.Direction.CW) }
            c.save(); c.clipPath(path); c.drawBitmap(src,null,Rect(308,278,772,742),null); c.restore()
        } ?: run {
            p.style=Paint.Style.FILL;p.color=Color.LTGRAY;c.drawCircle(540f,510f,230f,p)
            p.color=Color.DKGRAY;p.textAlign=Paint.Align.CENTER;p.textSize=30f;c.drawText("यहाँ आपका PNG फोटो आएगा",540f,520f,p)
        }
        val dark=Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.rgb(35,35,35);textAlign=Paint.Align.CENTER;typeface=Typeface.DEFAULT_BOLD }
        dark.textSize=58f;c.drawText(nameInput?.text?.toString()?.ifBlank{"आपका नाम"} ?: "आपका नाम",540f,850f,dark)
        dark.textSize=38f;c.drawText(placeInput?.text?.toString()?.ifBlank{"ग्राम पंचायत / स्थान"} ?: "ग्राम पंचायत / स्थान",540f,920f,dark)
        dark.color=Color.WHITE;dark.textSize=34f;c.drawText(templates[selected].subtitle,540f,1280f,dark)
        return b
    }

    private fun savePoster(){
        val dir=File(getExternalFilesDir(null),"posters").apply{mkdirs()}
        val file=File(dir,"RLP_"+System.currentTimeMillis()+".png")
        FileOutputStream(file).use{createPoster().compress(Bitmap.CompressFormat.PNG,100,it)}
        Toast.makeText(this,"पोस्टर तैयार: "+file.absolutePath,Toast.LENGTH_LONG).show()
    }
}