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

data class PosterTemplate(val title:String,val subtitle:String,val accent:Int,val layout:Int)

class MainActivity : AppCompatActivity() {
    private lateinit var preview: ImageView
    private lateinit var nameInput: EditText
    private lateinit var placeInput: EditText
    private lateinit var roleInput: EditText
    private var userBitmap: Bitmap? = null
    private var selected = 0
    private val templates = listOf(
        PosterTemplate("जनसभा","जनता की आवाज • मजबूत राजस्थान",Color.rgb(205,35,35),0),
        PosterTemplate("शुभकामना","आप सभी को हार्दिक शुभकामनाएं",Color.rgb(235,120,25),1),
        PosterTemplate("युवा शक्ति","युवा • किसान • आमजन",Color.rgb(20,90,60),2),
        PosterTemplate("विशेष संदेश","राजस्थान की मजबूत आवाज",Color.rgb(70,55,130),3),
        PosterTemplate("किसान सम्मान","किसान हित • जनहित",Color.rgb(150,95,25),4),
        PosterTemplate("जनसंपर्क","आपका अपना जनप्रतिनिधि",Color.rgb(170,25,55),5)
    )
    private val picker=registerForActivityResult(ActivityResultContracts.GetContent()){uri:Uri?->
        uri?.let{userBitmap=MediaStore.Images.Media.getBitmap(contentResolver,it);render()}
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val scroll=ScrollView(this)
        val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(20,20,20,20)}
        scroll.addView(root)
        root.addView(TextView(this).apply{text="RLP POSTER MAKER";textSize=28f;gravity=Gravity.CENTER;typeface=Typeface.DEFAULT_BOLD})
        root.addView(TextView(this).apply{text="टेम्पलेट चुनें • फोटो लगाएं • पोस्टर डाउनलोड करें";gravity=Gravity.CENTER})

        val hs=HorizontalScrollView(this)
        val bar=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL}
        templates.forEachIndexed{i,t->bar.addView(Button(this).apply{text=t.title;setOnClickListener{selected=i;render()}})}
        hs.addView(bar);root.addView(hs)

        preview=ImageView(this).apply{adjustViewBounds=true;minimumHeight=650;scaleType=ImageView.ScaleType.FIT_CENTER}
        root.addView(preview,LinearLayout.LayoutParams(-1,-2))
        nameInput=EditText(this).apply{hint="अपना नाम"}
        roleInput=EditText(this).apply{hint="पद / परिचय (वैकल्पिक)"}
        placeInput=EditText(this).apply{hint="ग्राम पंचायत / स्थान"}
        root.addView(nameInput);root.addView(roleInput);root.addView(placeInput)

        val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL}
        row.addView(Button(this).apply{text="फोटो चुनें";setOnClickListener{picker.launch("image/*")}},LinearLayout.LayoutParams(0,-2,1f))
        row.addView(Button(this).apply{text="PREVIEW";setOnClickListener{render()}},LinearLayout.LayoutParams(0,-2,1f))
        root.addView(row)
        root.addView(Button(this).apply{text="FULL HD PNG सेव करें";setOnClickListener{savePoster()}})
        setContentView(scroll);render()
    }

    private fun render(){preview.setImageBitmap(createPoster())}
    private fun createPoster():Bitmap{
        val w=1080;val h=1350;val t=templates[selected]
        val b=Bitmap.createBitmap(w,h,Bitmap.Config.ARGB_8888);val c=Canvas(b);val p=Paint(Paint.ANTI_ALIAS_FLAG)
        c.drawColor(Color.rgb(250,248,244))
        p.color=t.accent
        when(t.layout){
            0->{c.drawRect(0f,0f,w.toFloat(),180f,p);c.drawRect(0f,1180f,w.toFloat(),1350f,p)}
            1->{c.drawRect(0f,0f,70f,h.toFloat(),p);c.drawRect(1010f,0f,1080f,h.toFloat(),p)}
            2->{c.drawRect(0f,0f,w.toFloat(),150f,p);c.drawRect(0f,1050f,w.toFloat(),1350f,p)}
            3->{c.drawRect(0f,0f,w.toFloat(),260f,p)}
            4->{c.drawRect(0f,0f,w.toFloat(),1350f,p);p.color=Color.WHITE;c.drawRect(28f,28f,1052f,1322f,p)}
            else->{c.drawRect(0f,0f,w.toFloat(),200f,p);c.drawRect(0f,1150f,w.toFloat(),1350f,p)}
        }
        val head=Paint(Paint.ANTI_ALIAS_FLAG).apply{color=if(t.layout==4) t.accent else Color.WHITE;textAlign=Paint.Align.CENTER;typeface=Typeface.DEFAULT_BOLD;textSize=58f}
        c.drawText("राष्ट्रीय लोकतांत्रिक पार्टी",540f,90f,head)
        head.textSize=36f;c.drawText(t.title,540f,145f,head)

        val cx=if(t.layout==1) 430f else 540f;val cy=520f
        p.style=Paint.Style.STROKE;p.strokeWidth=16f;p.color=t.accent;c.drawCircle(cx,cy,245f,p);p.style=Paint.Style.FILL
        userBitmap?.let{src->
            val clip=Path().apply{addCircle(cx,cy,232f,Path.Direction.CW)}
            c.save();c.clipPath(clip);c.drawBitmap(src,null,Rect((cx-232).toInt(),(cy-232).toInt(),(cx+232).toInt(),(cy+232).toInt()),null);c.restore()
        }?:run{p.color=Color.LTGRAY;c.drawCircle(cx,cy,230f,p);p.color=Color.DKGRAY;p.textSize=28f;p.textAlign=Paint.Align.CENTER;c.drawText("आपका फोटो",cx,cy,p)}

        val dark=Paint(Paint.ANTI_ALIAS_FLAG).apply{color=Color.rgb(35,35,35);textAlign=Paint.Align.CENTER;typeface=Typeface.DEFAULT_BOLD}
        dark.textSize=60f;c.drawText(nameInput.text.toString().ifBlank{"आपका नाम"},540f,850f,dark)
        dark.textSize=34f;c.drawText(roleInput.text.toString().ifBlank{"जनसेवा के लिए समर्पित"},540f,910f,dark)
        dark.textSize=38f;c.drawText(placeInput.text.toString().ifBlank{"ग्राम पंचायत / स्थान"},540f,970f,dark)
        dark.color=if(t.layout==4) t.accent else Color.WHITE;dark.textSize=32f;c.drawText(t.subtitle,540f,1265f,dark)
        return b
    }
    private fun savePoster(){
        val dir=File(getExternalFilesDir(null),"posters").apply{mkdirs()}
        val file=File(dir,"RLP_"+templates[selected].title+"_"+System.currentTimeMillis()+".png")
        FileOutputStream(file).use{createPoster().compress(Bitmap.CompressFormat.PNG,100,it)}
        Toast.makeText(this,"Full HD पोस्टर सेव हुआ",Toast.LENGTH_LONG).show()
    }
}